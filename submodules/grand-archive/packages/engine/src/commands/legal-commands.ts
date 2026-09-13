import type {
  GrandArchiveActivatedAbility,
  GrandArchiveActivationState,
  GrandArchiveAbilityCost,
  GrandArchiveCardFace,
  GrandArchiveDefinitionKind,
  GrandArchiveEffect,
  GrandArchiveExecutableAbility,
  GrandArchiveKeyword,
  GrandArchiveModeDeclaration,
  GrandArchiveResolutionChoice,
  GrandArchiveSelectionCount,
  GrandArchiveTargetDeclaration,
  GrandArchiveVariableDeclaration,
} from "@tcg/grand-archive-types";
import {
  collectGrandArchiveModeTargets,
  declareGrandArchiveModes,
  declareGrandArchiveResolutionChoice,
  declareGrandArchiveTargets,
  getGrandArchiveAnnouncementModes,
  ruleGrantsPermissionToPlayer,
  type GrandArchiveAnnouncementModes,
  type GrandArchiveDeclaredModes,
  isGrandArchiveTargetCandidate,
} from "../procedures/activation/activation.ts";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveObjectFace,
} from "../game/card-runtime.ts";
import { grandArchiveObjectCurrentCharacteristics } from "../rules/state/continuous.ts";
import { payGrandArchiveAbilityCost } from "../procedures/activation/costs.ts";
import type {
  GrandArchiveAethercallingLoad,
  GrandArchiveCommand,
  GrandArchiveCostPaymentOrder,
  GrandArchiveGlimpseAnswer,
  GrandArchiveMoveName,
  GrandArchivePaymentContributionDeclaration,
  GrandArchivePrepareAbilityIndexes,
  GrandArchiveReservePaymentSource,
} from "./commands.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  matchesGrandArchiveCardFilter,
  resolveGrandArchivePlayers,
  type GrandArchiveEvaluationContext,
} from "../procedures/effects/evaluation.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveTargetId,
} from "../game/identity.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveDecision, GrandArchiveMatchState } from "../game/model.ts";
import {
  evaluateGrandArchiveActiveKeywordAmount,
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectActiveKeywordInstances,
  grandArchiveObjectActiveKeywords,
  grandArchiveObjectHasActiveKeyword,
} from "../rules/abilities/intrinsic-keywords.ts";
import { grandArchiveLinkTargetDeclaration } from "../game/link.ts";
import { composeGrandArchiveCardResolution } from "../procedures/activation/play-restrictions.ts";
import {
  collectGrandArchiveActionRules,
  collectGrandArchivePaymentContributionRules,
  grandArchiveGrantedKeywordsForAction,
  type GrandArchiveRuleRequest,
} from "../rules/state/rule-modifications.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import { grandArchivePlayerZoneObjectIds } from "../game/zone-ownership.ts";

export interface GrandArchiveLegalCommand {
  /** Player for whom this command was proven legal. */
  readonly playerId: GrandArchivePlayerId;
  /** Authoritative state version against which this command was proven legal. */
  readonly stateVersion: number;
  /** Fully-instantiated command accepted by the runtime from this exact state. */
  readonly command: GrandArchiveCommand;
  /** Short player-facing description suitable for simulator controls and transcripts. */
  readonly label: string;
}

export interface ListGrandArchiveLegalCommandsOptions {
  /** Concession is excluded by default so an automated player cannot select it accidentally. */
  readonly includeConcede?: boolean;
  /** Bounds combinatorial decisions for automation. Defaults to 256 candidates per expansion. */
  readonly maximumDecisionCandidates?: number;
  /**
   * Bounds otherwise-open chosen numeric declarations such as X for automation.
   * Defaults to 20; callers may raise it while direct player commands remain unbounded.
   */
  readonly maximumChosenVariableValue?: number;
}

export interface GrandArchiveDecisionAnswerCandidate {
  readonly answer: unknown;
  readonly label: string;
}

export function listGrandArchiveDecisionAnswerCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  decision: GrandArchiveDecision,
  options: Pick<
    ListGrandArchiveLegalCommandsOptions,
    "maximumDecisionCandidates" | "maximumChosenVariableValue"
  > = {},
): readonly GrandArchiveDecisionAnswerCandidate[] {
  return decisionAnswerCandidates(
    program,
    state,
    decision,
    options.maximumDecisionCandidates ?? 4096,
    options.maximumChosenVariableValue ?? 20,
  );
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive legal-command variant: ${JSON.stringify(value)}`);
}

function shortId(id: string): string {
  return id.length > 22 ? `${id.slice(0, 16)}…` : id;
}

function objectLabel(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
): string {
  const object = state.objects[objectId];
  if (!object) return shortId(objectId);
  try {
    return grandArchiveObjectFace(program, object).name;
  } catch {
    return shortId(objectId);
  }
}

function potentialTargetIds(state: GrandArchiveMatchState): readonly GrandArchiveTargetId[] {
  return [
    ...Object.values(state.objects).map((object) => object.id),
    ...Object.values(state.players).map((player) => player.id),
    ...state.stack.map((item) => item.id),
  ];
}

function selectionBounds(
  count: GrandArchiveSelectionCount,
  evaluation: GrandArchiveEvaluationContext,
  available: number,
): { readonly minimum: number; readonly maximum: number } {
  switch (count.kind) {
    case "exactly": {
      const amount = evaluateGrandArchiveAmount(count.amount, evaluation);
      return { minimum: amount, maximum: amount };
    }
    case "up-to":
      return {
        minimum: 0,
        maximum: Math.min(available, evaluateGrandArchiveAmount(count.amount, evaluation)),
      };
    case "at-least":
      return {
        minimum: evaluateGrandArchiveAmount(count.amount, evaluation),
        maximum: available,
      };
    case "between":
      return {
        minimum: evaluateGrandArchiveAmount(count.minimum, evaluation),
        maximum: Math.min(available, evaluateGrandArchiveAmount(count.maximum, evaluation)),
      };
    case "all":
      return { minimum: available, maximum: available };
    case "any-number":
      return { minimum: 0, maximum: available };
    case "conditional":
      return selectionBounds(
        evaluateGrandArchiveCondition(count.condition, evaluation) ? count.then : count.else,
        evaluation,
        available,
      );
    default:
      return assertNever(count);
  }
}

function combinations<T>(
  values: readonly T[],
  minimum: number,
  maximum: number,
  limit: number,
): readonly (readonly T[])[] {
  const out: T[][] = [];
  const selected: T[] = [];
  const visit = (start: number, requiredSize: number): void => {
    if (out.length >= limit) return;
    if (selected.length === requiredSize) {
      out.push([...selected]);
      return;
    }
    const stillNeeded = requiredSize - selected.length;
    for (let index = start; index < values.length && out.length < limit; index += 1) {
      if (values.length - index < stillNeeded) break;
      selected.push(values[index]!);
      visit(index + 1, requiredSize);
      selected.pop();
    }
  };
  for (let size = minimum; size <= maximum && out.length < limit; size += 1) {
    visit(0, size);
  }
  return out;
}

function permutations<T>(values: readonly T[], limit: number): readonly (readonly T[])[] {
  const out: T[][] = [];
  const remaining = [...values];
  const selected: T[] = [];
  const visit = (): void => {
    if (out.length >= limit) return;
    if (remaining.length === 0) {
      out.push([...selected]);
      return;
    }
    for (let index = 0; index < remaining.length && out.length < limit; index += 1) {
      const [value] = remaining.splice(index, 1);
      selected.push(value!);
      visit();
      selected.pop();
      remaining.splice(index, 0, value!);
    }
  };
  visit();
  return out;
}

function cartesian<T>(groups: readonly (readonly T[])[], limit: number): readonly (readonly T[])[] {
  let result: readonly (readonly T[])[] = [[]];
  for (const group of groups) {
    result = result.flatMap((prefix) => group.slice(0, limit).map((value) => [...prefix, value]));
    if (result.length > limit) result = result.slice(0, limit);
  }
  return result;
}

function targetAssignments(
  declarations: readonly GrandArchiveTargetDeclaration[],
  evaluation: GrandArchiveEvaluationContext,
  limit: number,
): readonly Readonly<Record<string, readonly GrandArchiveTargetId[]>>[] {
  let assignments: readonly Readonly<Record<string, readonly GrandArchiveTargetId[]>>[] = [{}];
  for (const [declarationIndex, declaration] of declarations.entries()) {
    if (declaration.method === "random") continue;
    const next: Readonly<Record<string, readonly GrandArchiveTargetId[]>>[] = [];
    for (const assignment of assignments) {
      const contextual = {
        ...evaluation,
        bindings: { ...evaluation.bindings, ...assignment },
      };
      const eligible = potentialTargetIds(evaluation.state).filter((targetId) =>
        isGrandArchiveTargetCandidate(targetId, declaration, contextual),
      );
      const bounds = selectionBounds(declaration.count, contextual, eligible.length);
      for (const chosen of combinations(eligible, bounds.minimum, bounds.maximum, limit)) {
        const candidate = { ...assignment, [declaration.id]: chosen };
        try {
          declareGrandArchiveTargets(
            declarations.slice(0, declarationIndex + 1),
            candidate,
            evaluation,
          );
          next.push(candidate);
        } catch {
          // Aggregate and relationship constraints reject this subset.
        }
        if (next.length >= limit) break;
      }
      if (next.length >= limit) break;
    }
    assignments = next;
    if (assignments.length === 0) return [];
  }
  return assignments;
}

function repeatedSelections<T>(
  values: readonly T[],
  amount: number,
  limit: number,
): readonly T[][] {
  if (amount === 0) return [[]];
  const out: T[][] = [];
  const selected: T[] = [];
  const visit = (): void => {
    if (out.length >= limit) return;
    if (selected.length === amount) {
      out.push([...selected]);
      return;
    }
    for (const value of values) {
      selected.push(value);
      visit();
      selected.pop();
      if (out.length >= limit) return;
    }
  };
  visit();
  return out;
}

function declaredModeCandidates(
  declaration: GrandArchiveAnnouncementModes | undefined,
  evaluation: GrandArchiveEvaluationContext,
  limit: number,
): readonly GrandArchiveDeclaredModes[] {
  if (!declaration) return [declareGrandArchiveModes(undefined, undefined, evaluation)];
  if (declaration.random) {
    try {
      return [declareGrandArchiveModes(declaration, undefined, evaluation)];
    } catch {
      return [];
    }
  }
  const eligible = declaration.modes.filter(
    (mode) => !mode.condition || evaluateGrandArchiveCondition(mode.condition, evaluation),
  );
  const bounds = selectionBounds(declaration.choose, evaluation, eligible.length);
  const modeIds = eligible.map((mode) => mode.id);
  const raw: (readonly string[])[] = [];
  for (let amount = bounds.minimum; amount <= bounds.maximum && raw.length < limit; amount += 1) {
    raw.push(
      ...(declaration.allowRepeat
        ? repeatedSelections(modeIds, amount, limit - raw.length)
        : combinations(modeIds, amount, amount, limit - raw.length)),
    );
  }
  return raw.flatMap((ids): readonly GrandArchiveDeclaredModes[] => {
    try {
      return [declareGrandArchiveModes(declaration, ids, evaluation)];
    } catch {
      return [];
    }
  });
}

function chosenVariableAssignments(
  declarations: readonly GrandArchiveVariableDeclaration[] | undefined,
  evaluation: GrandArchiveEvaluationContext,
  initial: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>,
  maximumChosenVariableValue: number,
  limit: number,
): readonly Readonly<Partial<Record<"X" | "Y" | "Z", number>>>[] {
  let assignments: readonly Readonly<Partial<Record<"X" | "Y" | "Z", number>>>[] = [initial];
  for (const declaration of declarations ?? []) {
    if (declaration.kind !== "chosen") continue;
    const next: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>[] = [];
    for (const assignment of assignments) {
      const contextual = {
        ...evaluation,
        variables: { ...evaluation.variables, ...assignment },
      };
      const minimum = evaluateGrandArchiveAmount(declaration.minimum, contextual);
      const declaredMaximum = declaration.maximum
        ? evaluateGrandArchiveAmount(declaration.maximum, contextual)
        : maximumChosenVariableValue;
      const maximum = Math.min(declaredMaximum, maximumChosenVariableValue);
      const existing = assignment[declaration.symbol];
      if (existing !== undefined) {
        if (Number.isSafeInteger(existing) && existing >= minimum && existing <= declaredMaximum) {
          next.push(assignment);
        }
        continue;
      }
      for (let value = minimum; value <= maximum && next.length < limit; value += 1) {
        if (!Number.isSafeInteger(value)) break;
        next.push({ ...assignment, [declaration.symbol]: value });
      }
      if (next.length >= limit) break;
    }
    assignments = next;
    if (assignments.length === 0) return [];
  }
  return assignments;
}

interface GrandArchiveAnnouncementDescriptor {
  readonly variables?: readonly GrandArchiveVariableDeclaration[];
  readonly modes?: GrandArchiveModeDeclaration;
  readonly effect?: GrandArchiveEffect;
  readonly targets?: readonly GrandArchiveTargetDeclaration[];
}

interface GrandArchiveAnnouncementCandidate {
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

function announcementCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  describe: (evaluation: GrandArchiveEvaluationContext) => GrandArchiveAnnouncementDescriptor,
  options: {
    readonly cardTargetSourceId?: GrandArchiveObjectId;
    readonly forcedVariables?: readonly GrandArchiveVariableDeclaration[];
    readonly announcementActivationStates?: readonly GrandArchiveActivationState[];
    readonly maximumChosenVariableValue: number;
    readonly limit: number;
  },
): readonly GrandArchiveAnnouncementCandidate[] {
  const baseEvaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId,
    abilityBearerId: sourceId,
    bindings: {},
    ...(options.announcementActivationStates
      ? { announcementActivationStates: options.announcementActivationStates }
      : {}),
  };
  const initialDescriptor = describe(baseEvaluation);
  const baseVariableDeclarations = [
    ...(options.forcedVariables ?? []),
    ...(initialDescriptor.variables ?? []),
  ];
  const baseAssignments = chosenVariableAssignments(
    baseVariableDeclarations,
    baseEvaluation,
    {},
    options.maximumChosenVariableValue,
    options.limit,
  );
  const out: GrandArchiveAnnouncementCandidate[] = [];
  for (const baseVariables of baseAssignments) {
    const variableEvaluation = { ...baseEvaluation, variables: baseVariables };
    const descriptor = describe(variableEvaluation);
    const modesDeclaration = getGrandArchiveAnnouncementModes(
      descriptor.modes,
      descriptor.effect,
      variableEvaluation,
    );
    for (const declaredModes of declaredModeCandidates(
      modesDeclaration,
      variableEvaluation,
      options.limit,
    )) {
      const modeAssignments = chosenVariableAssignments(
        declaredModes.modes.flatMap((mode) => mode.variables ?? []),
        variableEvaluation,
        baseVariables,
        options.maximumChosenVariableValue,
        options.limit,
      );
      for (const variables of modeAssignments) {
        const finalEvaluation = { ...baseEvaluation, variables };
        const finalDescriptor = describe(finalEvaluation);
        const declarations = collectGrandArchiveModeTargets(
          finalDescriptor.targets,
          declaredModes.modes,
        );
        const card = options.cardTargetSourceId
          ? state.objects[options.cardTargetSourceId]
          : undefined;
        const link = card ? grandArchiveLinkTargetDeclaration(program, state, card) : undefined;
        const allDeclarations = link ? [...declarations, link] : declarations;
        const assignments = targetAssignments(allDeclarations, finalEvaluation, options.limit);
        for (const targets of assignments.length > 0 ? assignments : [{}]) {
          out.push({
            ...(declaredModes.ids.length > 0 ? { modeIds: declaredModes.ids } : {}),
            ...(Object.keys(targets).length > 0 ? { targets } : {}),
            ...(Object.keys(variables).length > 0 ? { variables } : {}),
          });
          if (out.length >= options.limit) return out;
        }
      }
    }
  }
  return out;
}

function resolutionEvaluation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): GrandArchiveEvaluationContext | undefined {
  const resolution = state.resolution;
  if (!resolution) return undefined;
  return {
    program,
    state,
    controllerId: resolution.controllerId,
    ...(resolution.sourceId
      ? {
          sourceId: resolution.sourceId,
          abilityBearerId: resolution.sourceId,
          sourceIdentityId: resolution.sourceId,
          ...(resolution.sourceIncarnation !== undefined
            ? { sourceIncarnation: resolution.sourceIncarnation }
            : {}),
        }
      : {}),
    ...(resolution.sourceLkiEventId ? { sourceLkiEventId: resolution.sourceLkiEventId } : {}),
    bindings: resolution.bindings,
    variables: resolution.variables,
    resolvingStackItemId: resolution.stackItemId,
    resolutionStartedEventHistoryIndex: resolution.startedEventHistoryIndex,
  };
}

function characteristicCandidates(
  program: GrandArchiveMatchProgram,
  characteristic: Extract<
    GrandArchiveResolutionChoice["candidates"],
    { readonly kind: "characteristic" }
  >["characteristic"],
): readonly string[] {
  const values = new Set<string>();
  for (const card of Object.values(program.cardsById)) {
    const faces =
      card.layout.kind === "single-faced"
        ? [card.layout.face]
        : [card.layout.defaultFace, card.layout.flipFace];
    for (const face of faces) {
      if (characteristic === "card-name") values.add(face.name);
      else if (characteristic === "type") face.typeLine.types.forEach((value) => values.add(value));
      else if (characteristic === "class")
        face.typeLine.classes.forEach((value) => values.add(value));
      else if (characteristic === "element") face.elements.forEach((value) => values.add(value));
      else face.typeLine.subtypes.forEach((value) => values.add(value));
    }
  }
  return [...values].sort();
}

function resolutionChoiceAnswers(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  selection: GrandArchiveResolutionChoice,
  evaluation: GrandArchiveEvaluationContext,
  limit: number,
  maximumChosenVariableValue: number,
  options: { readonly mayFailToFind?: true } = {},
): readonly unknown[] {
  const choice = selection.candidates;
  if (
    choice.kind === "card" ||
    choice.kind === "object" ||
    choice.kind === "union" ||
    choice.kind === "stack-item" ||
    choice.kind === "player"
  ) {
    const declaration: GrandArchiveTargetDeclaration = {
      ...selection,
      kind: "target",
      declared: "announcement",
    };
    const eligible = potentialTargetIds(state).filter((targetId) =>
      isGrandArchiveTargetCandidate(targetId, declaration, evaluation),
    );
    const bounds = selectionBounds(selection.count, evaluation, eligible.length);
    const ordinary = combinations(eligible, bounds.minimum, bounds.maximum, limit);
    const answers =
      options.mayFailToFind && bounds.minimum > 0 ? [[], ...ordinary].slice(0, limit) : ordinary;
    return answers.filter((answer) => {
      try {
        declareGrandArchiveResolutionChoice(selection, answer, evaluation, options);
        return true;
      } catch {
        return false;
      }
    });
  }
  if (choice.kind === "number") {
    const minimum = evaluateGrandArchiveAmount(choice.minimum, evaluation);
    const declaredMaximum = choice.maximum
      ? evaluateGrandArchiveAmount(choice.maximum, evaluation)
      : maximumChosenVariableValue;
    const maximum = Math.min(declaredMaximum, maximumChosenVariableValue);
    if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum) || maximum < minimum) {
      return [];
    }
    return Array.from(
      { length: Math.min(maximum - minimum + 1, limit) },
      (_, index) => minimum + index,
    );
  }
  if (choice.kind === "option") return choice.options;
  const values =
    choice.kind === "catalog-card"
      ? Object.keys(program.cardsById)
      : characteristicCandidates(program, choice.characteristic);
  const bounds = selectionBounds(selection.count, evaluation, values.length);
  return combinations(values, bounds.minimum, bounds.maximum, limit).filter((answer) => {
    try {
      declareGrandArchiveResolutionChoice(selection, answer, evaluation);
      return true;
    } catch {
      return false;
    }
  });
}

export type GrandArchiveStructuredDecision =
  | { readonly kind: "semantic" }
  | {
      readonly kind: "boolean";
    }
  | {
      readonly kind: "identity-selection";
      readonly candidateIds: readonly string[];
      readonly minimum: number;
      readonly maximum: number;
      readonly ordered: boolean;
    }
  | {
      readonly kind: "ordering";
      readonly candidateIds: readonly string[];
    }
  | {
      readonly kind: "option-selection";
      readonly optionIds: readonly string[];
      readonly minimum: number;
      readonly maximum: number;
    }
  | {
      readonly kind: "partition";
      readonly candidateIds: readonly string[];
      readonly routeIds: readonly [string, string];
    }
  | {
      readonly kind: "allocation";
      readonly candidates: readonly {
        readonly id: string;
        readonly minimum: number;
        readonly maximum: number;
      }[];
      readonly totalMinimum: number;
      readonly totalMaximum: number;
    };

/**
 * Describes decisions whose complete answer space is better represented as
 * structured input than as an eagerly enumerated Cartesian product.
 */
export function describeGrandArchiveStructuredDecision(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  decision: GrandArchiveDecision,
): GrandArchiveStructuredDecision {
  switch (decision.kind) {
    case "choose-replacement":
      return decision.mode === "order"
        ? {
            kind: "option-selection",
            optionIds: decision.candidateIds,
            minimum: 1,
            maximum: 1,
          }
        : { kind: "boolean" };
    case "choose-unique-object":
      return {
        kind: "identity-selection",
        candidateIds: decision.candidates,
        minimum: 1,
        maximum: 1,
        ordered: false,
      };
    case "choose-preserve-destination":
    case "resolve-optional-effect":
      return { kind: "boolean" };
    case "choose-retaliators":
      return {
        kind: "identity-selection",
        candidateIds: decision.candidates,
        minimum: 0,
        maximum: decision.candidates.length,
        ordered: false,
      };
    case "discard-to-influence-limit":
    case "choose-recollection":
      return {
        kind: "identity-selection",
        candidateIds: decision.candidateIds,
        minimum: decision.amount,
        maximum: decision.amount,
        ordered: false,
      };
    case "order-retaliation-damage":
      return { kind: "ordering", candidateIds: decision.retaliatorIds };
    case "order-triggered-abilities":
      return { kind: "ordering", candidateIds: decision.pendingTriggerIds };
    case "choose-delegated-defender":
      return {
        kind: "identity-selection",
        candidateIds: decision.candidateIds,
        minimum: 1,
        maximum: 1,
        ordered: false,
      };
    case "resolve-level-up":
      return {
        kind: "identity-selection",
        candidateIds: decision.candidateCardIds,
        minimum: 1,
        maximum: 1,
        ordered: false,
      };
    case "resolve-direction-choice":
      return {
        kind: "option-selection",
        optionIds: decision.directions,
        minimum: 1,
        maximum: 1,
      };
    case "resolve-move-partition":
      return {
        kind: "partition",
        candidateIds: decision.objectIds,
        routeIds: ["first", "second"],
      };
    case "resolve-counter-allocation":
      return {
        kind: "allocation",
        candidates: decision.candidates.map((candidate) => ({
          id: candidate.objectId,
          minimum: 0,
          maximum: candidate.available,
        })),
        totalMinimum: decision.minimum,
        totalMaximum: decision.maximum,
      };
    case "resolve-distribution": {
      const evaluation = resolutionEvaluation(program, state);
      if (!evaluation) return { kind: "semantic" };
      const selection = decision.among;
      const choice = selection.candidates;
      if (
        choice.kind !== "card" &&
        choice.kind !== "object" &&
        choice.kind !== "union" &&
        choice.kind !== "stack-item" &&
        choice.kind !== "player"
      ) {
        return { kind: "semantic" };
      }
      const declaration: GrandArchiveTargetDeclaration = {
        ...selection,
        kind: "target",
        declared: "announcement",
      };
      const candidateIds = potentialTargetIds(state).filter((targetId) =>
        isGrandArchiveTargetCandidate(targetId, declaration, evaluation),
      );
      return {
        kind: "allocation",
        candidates: candidateIds.map((id) => ({
          id,
          minimum: 0,
          maximum: decision.amount,
        })),
        totalMinimum: decision.amount,
        totalMaximum: decision.amount,
      };
    }
    case "resolve-effect-choice": {
      const selection = decision.selection;
      if (
        selection.allowRepeated ||
        selection.aggregateConstraint ||
        selection.extreme ||
        selection.allShareCharacteristic ||
        selection.singleZoneOwner
      ) {
        return { kind: "semantic" };
      }
      const evaluation = resolutionEvaluation(program, state);
      if (!evaluation) return { kind: "semantic" };
      const choice = selection.candidates;
      if (
        choice.kind === "card" ||
        choice.kind === "object" ||
        choice.kind === "union" ||
        choice.kind === "stack-item" ||
        choice.kind === "player"
      ) {
        const declaration: GrandArchiveTargetDeclaration = {
          ...selection,
          kind: "target",
          declared: "announcement",
        };
        const candidateIds = potentialTargetIds(state).filter((targetId) =>
          isGrandArchiveTargetCandidate(targetId, declaration, evaluation),
        );
        const bounds = selectionBounds(selection.count, evaluation, candidateIds.length);
        return {
          kind: "identity-selection",
          candidateIds,
          minimum: decision.mayFailToFind ? 0 : bounds.minimum,
          maximum: bounds.maximum,
          ordered: true,
        };
      }
      if (choice.kind === "option") {
        return {
          kind: "option-selection",
          optionIds: choice.options,
          minimum: 1,
          maximum: 1,
        };
      }
      return { kind: "semantic" };
    }
    case "resolve-critical":
    case "declare-resolved-attack":
    case "announce-triggered-ability":
    case "retarget-stack-item":
    case "remode-stack-item":
    case "resolve-effect-payment":
    case "announce-effect-attack":
    case "announce-effect-materialization":
    case "announce-effect-activation":
    case "resolve-glimpse":
      return { kind: "semantic" };
  }
}

function selectableCostCount(cost: GrandArchiveAbilityCost): number {
  switch (cost.kind) {
    case "all":
      return cost.costs.reduce((total, child) => total + selectableCostCount(child), 0);
    case "one-of":
      return Math.max(0, ...cost.costs.map(selectableCostCount));
    case "optional":
      return selectableCostCount(cost.cost);
    case "select-and-sacrifice":
    case "select-and-rest":
    case "select-and-move":
    case "select-and-remove-counters":
    case "select-and-reveal":
    case "reveal":
      return cost.kind === "select-and-move" && cost.random ? 0 : 1;
    default:
      return 0;
  }
}

function maximumCostOptionCount(cost: GrandArchiveAbilityCost): number {
  switch (cost.kind) {
    case "one-of":
      return Math.max(cost.costs.length, ...cost.costs.map(maximumCostOptionCount));
    case "all":
      return Math.max(0, ...cost.costs.map(maximumCostOptionCount));
    case "optional":
      return maximumCostOptionCount(cost.cost);
    default:
      return 0;
  }
}

function costHasOptionalBranch(cost: GrandArchiveAbilityCost): boolean {
  switch (cost.kind) {
    case "all":
    case "one-of":
      return cost.costs.some(costHasOptionalBranch);
    case "optional":
      return true;
    default:
      return false;
  }
}

function costPaymentOrderCandidates(
  cost: GrandArchiveAbilityCost,
  costOptionIndex: number | undefined,
  payOptionalCost: boolean | undefined,
  limit: number,
): readonly (readonly GrandArchiveCostPaymentOrder[])[] {
  const nodes: { readonly path: readonly number[]; readonly length: number }[] = [];
  const visit = (current: GrandArchiveAbilityCost, path: readonly number[]): void => {
    switch (current.kind) {
      case "all":
        nodes.push({ path, length: current.costs.length });
        current.costs.forEach((child, index) => visit(child, [...path, index]));
        return;
      case "one-of": {
        const index = costOptionIndex ?? 0;
        const selected = current.costs[index];
        if (selected) visit(selected, [...path, index]);
        return;
      }
      case "optional":
        if (payOptionalCost) visit(current.cost, [...path, 0]);
        return;
      default:
        return;
    }
  };
  visit(cost, []);
  const choices = nodes.map(({ path, length }) => {
    const identity = Array.from({ length }, (_, index) => index);
    return [
      undefined,
      ...permutations(identity, limit).flatMap((order) =>
        order.every((index, position) => index === position) ? [] : [{ path, order }],
      ),
    ] as const;
  });
  return cartesian(choices, limit).map((declarations) =>
    declarations.filter(
      (declaration): declaration is GrandArchiveCostPaymentOrder => declaration !== undefined,
    ),
  );
}

function paymentCandidates(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  cost: GrandArchiveAbilityCost,
  sourceId: GrandArchiveObjectId | undefined,
  limit: number,
): readonly Readonly<Record<string, unknown>>[] {
  const reserveSources: GrandArchiveReservePaymentSource[] = [
    ...state.zones[playerId].hand.flatMap((cardId) =>
      cardId === sourceId ? [] : [{ kind: "card" as const, cardId }],
    ),
    ...grandArchivePlayerZoneObjectIds(state, playerId, "field").flatMap((objectId) => {
      const object = state.objects[objectId];
      return object && !object.states.has("rested")
        ? [{ kind: "reservable" as const, objectId }]
        : [];
    }),
  ];
  const reserveChoices = combinations(reserveSources, 0, reserveSources.length, limit);
  const selectionCount = selectableCostCount(cost);
  const objectIds = Object.values(state.objects).map((object) => object.id);
  const rawSelectionChoices: readonly (readonly GrandArchiveObjectId[])[] =
    selectionCount === 0
      ? []
      : [
          [],
          ...objectIds.flatMap((objectId) =>
            Array.from({ length: 4 }, (_, index) =>
              Array.from({ length: index + 1 }, () => objectId),
            ),
          ),
          ...combinations(objectIds, 1, Math.min(objectIds.length, 4), limit),
        ];
  const selectionChoices = rawSelectionChoices.filter(
    (selection, index) =>
      rawSelectionChoices.findIndex(
        (candidate) =>
          candidate.length === selection.length &&
          candidate.every((objectId, candidateIndex) => objectId === selection[candidateIndex]),
      ) === index,
  );
  const selectionDeclarations = cartesian(
    Array.from({ length: selectionCount }, () => selectionChoices),
    limit,
  );
  const optionCount = maximumCostOptionCount(cost);
  const optionIndexes: readonly (number | undefined)[] =
    optionCount > 0 ? Array.from({ length: optionCount }, (_, index) => index) : [undefined];
  const optionalDeclarations: readonly (true | undefined)[] = costHasOptionalBranch(cost)
    ? [undefined, true]
    : [undefined];
  const out: Readonly<Record<string, unknown>>[] = [];
  for (const reservePayment of reserveChoices) {
    for (const costSelections of selectionDeclarations.length > 0 ? selectionDeclarations : [[]]) {
      for (const costOptionIndex of optionIndexes) {
        for (const payOptionalCost of optionalDeclarations) {
          const paymentOrders = costPaymentOrderCandidates(
            cost,
            costOptionIndex,
            payOptionalCost,
            limit - out.length,
          );
          for (const costPaymentOrders of paymentOrders) {
            out.push({
              ...(reservePayment.length > 0 ? { reservePayment } : {}),
              ...(costSelections.length > 0 ? { costSelections } : {}),
              ...(costPaymentOrders.length > 0 ? { costPaymentOrders } : {}),
              ...(costOptionIndex !== undefined ? { costOptionIndex } : {}),
              ...(payOptionalCost !== undefined ? { payOptionalCost } : {}),
            });
            if (out.length >= limit) return out;
          }
        }
      }
    }
  }
  return out;
}

function paymentContributionDeclarationCandidates(
  request: GrandArchiveRuleRequest,
  limit: number,
): readonly (readonly GrandArchivePaymentContributionDeclaration[])[] {
  const rules = collectGrandArchivePaymentContributionRules(request);
  if (rules.length === 0) return [[]];
  let combinations: readonly (readonly GrandArchivePaymentContributionDeclaration[])[] = [[]];
  for (const rule of rules) {
    const declarations: GrandArchivePaymentContributionDeclaration[] = [];
    if (rule.effect.cost) {
      const contributionCost = rule.effect.cost;
      for (const payment of paymentCandidates(
        request.evaluation.state,
        rule.evaluation.controllerId,
        contributionCost,
        rule.evaluation.sourceId,
        limit,
      )) {
        try {
          const result = payGrandArchiveAbilityCost(contributionCost, payment, rule.evaluation);
          if (result.paidUnits === 0) continue;
        } catch {
          continue;
        }
        declarations.push({ ruleId: rule.id, ...payment });
        if (declarations.length >= limit) break;
      }
    } else {
      const fromZone = rule.effect.fromZone;
      const paymentOwner = rule.effect.paymentOwner;
      const paymentSourceFilter = rule.effect.paymentSourceFilter;
      if (!fromZone || !paymentOwner || !paymentSourceFilter) continue;
      const owners = resolveGrandArchivePlayers(paymentOwner, rule.evaluation);
      const eligible = Object.values(request.evaluation.state.objects).flatMap((object) =>
        object.zone === fromZone &&
        owners.includes(object.ownerId) &&
        matchesGrandArchiveCardFilter(object, paymentSourceFilter, {
          ...rule.evaluation,
          candidateId: object.id,
        })
          ? [object.id]
          : [],
      );
      declarations.push(
        ...combinationsOfPaymentSources(eligible, limit).map((paymentSourceIds) => ({
          ruleId: rule.id,
          paymentSourceIds,
        })),
      );
    }
    const choices: readonly (GrandArchivePaymentContributionDeclaration | undefined)[] = [
      undefined,
      ...declarations,
    ];
    const next: (readonly GrandArchivePaymentContributionDeclaration[])[] = [];
    for (const existing of combinations) {
      for (const declaration of choices) {
        next.push(declaration ? [...existing, declaration] : existing);
        if (next.length >= limit) break;
      }
      if (next.length >= limit) break;
    }
    combinations = next;
  }
  return combinations;
}

function combinationsOfPaymentSources(
  objectIds: readonly GrandArchiveObjectId[],
  limit: number,
): readonly (readonly GrandArchiveObjectId[])[] {
  return combinations(objectIds, 1, objectIds.length, limit);
}

function combineCandidateCosts(
  first: GrandArchiveAbilityCost | undefined,
  second: GrandArchiveAbilityCost | undefined,
): GrandArchiveAbilityCost | undefined {
  if (!first) return second;
  if (!second) return first;
  return { kind: "all", costs: [first, second] };
}

function printedCandidateCost(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility, GrandArchiveDefinitionKind>,
  additionalCost: GrandArchiveAbilityCost | undefined,
): GrandArchiveAbilityCost | undefined {
  const printed =
    face.cost.kind === "none"
      ? undefined
      : {
          kind: face.cost.kind === "reserve" ? ("pay-reserve" as const) : ("pay-memory" as const),
          amount: face.cost.amount,
        };
  return combineCandidateCosts(printed, additionalCost);
}

function paymentDeclarationCandidates(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  cost: GrandArchiveAbilityCost | undefined,
  sourceId: GrandArchiveObjectId,
  limit: number,
): readonly Readonly<Record<string, unknown>>[] {
  return cost ? paymentCandidates(state, playerId, cost, sourceId, limit) : [{}];
}

function variableCostDeclaration(
  face: GrandArchiveCardFace<GrandArchiveExecutableAbility, GrandArchiveDefinitionKind>,
): readonly GrandArchiveVariableDeclaration[] {
  return face.cost.kind !== "none" && typeof face.cost.amount !== "number"
    ? [{ symbol: face.cost.amount.symbol, kind: "chosen", minimum: 0 }]
    : [];
}

function cardAnnouncementCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  maximumChosenVariableValue: number,
  limit: number,
  activationCostOverride?: GrandArchiveAbilityCost | null,
  announcementActivationStates?: readonly GrandArchiveActivationState[],
): readonly {
  readonly announcement: GrandArchiveAnnouncementCandidate;
  readonly payment: Readonly<Record<string, unknown>>;
}[] {
  const source = state.objects[sourceId];
  if (!source) return [];
  const face = grandArchiveObjectFace(program, source);
  const describe = (evaluation: GrandArchiveEvaluationContext) => {
    const resolution = composeGrandArchiveCardResolution(face, evaluation);
    return {
      ...(resolution?.variables ? { variables: resolution.variables } : {}),
      ...(resolution?.modes ? { modes: resolution.modes } : {}),
      ...(resolution?.effect ? { effect: resolution.effect } : {}),
      ...(resolution?.targets ? { targets: resolution.targets } : {}),
    };
  };
  const announcements = announcementCandidates(program, state, playerId, sourceId, describe, {
    cardTargetSourceId: sourceId,
    forcedVariables: [
      ...variableCostDeclaration(face),
      ...grandArchiveObjectActiveAbilities(program, state, source).flatMap((ability) =>
        ability.kind === "static" && ability.staticKind === "intrinsic"
          ? (ability.variables ?? [])
          : [],
      ),
    ],
    ...(announcementActivationStates ? { announcementActivationStates } : {}),
    maximumChosenVariableValue,
    limit,
  });
  const initialEvaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId,
    abilityBearerId: sourceId,
    bindings: {},
    ...(announcementActivationStates ? { announcementActivationStates } : {}),
  };
  const resolution = composeGrandArchiveCardResolution(face, initialEvaluation);
  const payments = paymentDeclarationCandidates(
    state,
    playerId,
    combineCandidateCosts(
      activationCostOverride === undefined
        ? printedCandidateCost(face, undefined)
        : (activationCostOverride ?? undefined),
      resolution?.additionalCost,
    ),
    sourceId,
    limit,
  );
  const out: {
    readonly announcement: GrandArchiveAnnouncementCandidate;
    readonly payment: Readonly<Record<string, unknown>>;
  }[] = [];
  for (const announcement of announcements) {
    const contributionEvaluation: GrandArchiveEvaluationContext = {
      ...initialEvaluation,
      bindings: announcement.targets ?? {},
      variables: announcement.variables ?? {},
    };
    const contributionSets = paymentContributionDeclarationCandidates(
      {
        action: "pay-cost",
        activationKind: "card",
        playerId,
        candidateId: sourceId,
        fromZone: source.zone,
        evaluation: contributionEvaluation,
      },
      limit,
    );
    for (const payment of payments) {
      for (const paymentContributions of contributionSets) {
        out.push({
          announcement,
          payment: {
            ...payment,
            ...(paymentContributions.length > 0 ? { paymentContributions } : {}),
          },
        });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

type GrandArchiveBrewKeyword = Extract<GrandArchiveKeyword, { readonly name: "brew" }>;
type GrandArchiveAlternativeActivationKeyword = Extract<
  GrandArchiveKeyword,
  { readonly name: "ephemerate" | "starcalling" }
>;

interface GrandArchiveCardActivationCandidate {
  readonly activationMethod?: "brew" | "ephemerate" | "starcalling";
  readonly brewIngredientIds?: readonly GrandArchiveObjectId[];
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly reservePayment?: readonly GrandArchiveReservePaymentSource[];
  readonly revealForImbue?: boolean;
  readonly kindleCardIds?: readonly GrandArchiveObjectId[];
  readonly floatingMemoryCardIds?: readonly GrandArchiveObjectId[];
  readonly paymentContributions?: readonly GrandArchivePaymentContributionDeclaration[];
  readonly costSelections?: readonly (readonly GrandArchiveObjectId[])[];
  readonly costOptionIndex?: number;
  readonly payOptionalCost?: boolean;
  readonly prepareAbilityIndexes?: GrandArchivePrepareAbilityIndexes;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

function prepareAbilityIndexChoices(
  count: number,
  limit: number,
): readonly (GrandArchivePrepareAbilityIndexes | undefined)[] {
  const choices: (GrandArchivePrepareAbilityIndexes | undefined)[] = [undefined];
  const indexes = Array.from({ length: count }, (_, index) => index);
  for (const subset of combinations(indexes, 1, indexes.length, limit)) {
    for (const ordered of permutations(subset, limit)) {
      const [first, ...rest] = ordered;
      if (first === undefined) continue;
      choices.push([first, ...rest]);
      if (choices.length >= limit) return choices;
    }
  }
  return choices;
}

function brewIngredientCandidates(
  keyword: GrandArchiveBrewKeyword,
  evaluation: GrandArchiveEvaluationContext,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  limit: number,
): readonly (readonly GrandArchiveObjectId[])[] {
  const amount = keyword.requirements.reduce(
    (total, requirement) => total + evaluateGrandArchiveAmount(requirement.count, evaluation),
    0,
  );
  if (!Number.isSafeInteger(amount) || amount < 0) return [];
  return combinations(
    grandArchivePlayerZoneObjectIds(state, playerId, "field"),
    amount,
    amount,
    limit,
  );
}

function optionalCardActivationFields(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  announcement: GrandArchiveAnnouncementCandidate,
  activationMethod: GrandArchiveCardActivationCandidate["activationMethod"],
  limit: number,
  revealForImbueDeclaration?: true,
): readonly GrandArchiveCardActivationCandidate[] {
  const source = state.objects[sourceId];
  if (!source) return [];
  const face = grandArchiveObjectFace(program, source);
  const keywordInstances = grandArchiveObjectActiveKeywordInstances(program, state, source);
  const prepareChoices = prepareAbilityIndexChoices(
    keywordInstances.filter((instance) => instance.keyword.name === "prepare").length,
    limit,
  );
  const imbueChoices: readonly (boolean | undefined)[] = revealForImbueDeclaration
    ? [true]
    : [undefined];
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId,
    abilityBearerId: sourceId,
    bindings: announcement.targets ?? {},
    variables: announcement.variables ?? {},
  };
  const kindleMaximum = keywordInstances
    .filter(
      (
        instance,
      ): instance is typeof instance & {
        readonly keyword: GrandArchiveKeyword & {
          readonly name: "kindle";
          readonly value: import("@tcg/grand-archive-types").GrandArchiveAmount;
        };
      } => instance.keyword.name === "kindle",
    )
    .reduce(
      (maximum, instance) =>
        Math.max(
          maximum,
          evaluateGrandArchiveActiveKeywordAmount(instance, instance.keyword.value, evaluation),
        ),
      0,
    );
  const fireGraveyardCards = state.zones[playerId].graveyard.filter((objectId) => {
    const object = state.objects[objectId];
    return (
      object &&
      object.id !== sourceId &&
      grandArchiveObjectCurrentCharacteristics(program, state, object).elements.includes("FIRE")
    );
  });
  const kindleChoices: readonly (readonly GrandArchiveObjectId[] | undefined)[] =
    kindleMaximum > 0
      ? [
          undefined,
          ...combinations(
            fireGraveyardCards,
            1,
            Math.min(kindleMaximum, fireGraveyardCards.length),
            limit,
          ),
        ]
      : [undefined];
  const floatingCards =
    activationMethod === undefined && face.cost.kind === "memory"
      ? state.zones[playerId].graveyard.filter((objectId) => {
          const object = state.objects[objectId];
          return (
            object &&
            object.id !== sourceId &&
            grandArchiveObjectHasActiveKeyword(program, state, object, "floating-memory")
          );
        })
      : [];
  const floatingChoices: readonly (readonly GrandArchiveObjectId[] | undefined)[] =
    floatingCards.length > 0
      ? [undefined, ...combinations(floatingCards, 1, floatingCards.length, limit)]
      : [undefined];
  const out: GrandArchiveCardActivationCandidate[] = [];
  for (const prepareAbilityIndexes of prepareChoices) {
    for (const revealForImbue of imbueChoices) {
      for (const kindleCardIds of kindleChoices) {
        for (const floatingMemoryCardIds of floatingChoices) {
          out.push({
            ...announcement,
            ...(activationMethod ? { activationMethod } : {}),
            ...(prepareAbilityIndexes ? { prepareAbilityIndexes } : {}),
            ...(revealForImbue !== undefined ? { revealForImbue } : {}),
            ...(kindleCardIds ? { kindleCardIds } : {}),
            ...(floatingMemoryCardIds ? { floatingMemoryCardIds } : {}),
          });
          if (out.length >= limit) return out;
        }
      }
    }
  }
  return out;
}

function cardActivationCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  maximumChosenVariableValue: number,
  limit: number,
): readonly GrandArchiveCardActivationCandidate[] {
  const source = state.objects[sourceId];
  if (!source) return [];
  const keywords = grandArchiveObjectActiveKeywords(program, state, source);
  const methods: {
    readonly activationMethod?: "brew" | "ephemerate";
    readonly costOverride?: GrandArchiveAbilityCost | null;
    readonly brewKeyword?: GrandArchiveBrewKeyword;
  }[] = [{ costOverride: undefined }];
  for (const keyword of keywords) {
    if (keyword.name === "ephemerate") {
      methods.push({ activationMethod: "ephemerate", costOverride: keyword.cost });
    } else if (keyword.name === "brew") {
      methods.push({ activationMethod: "brew", costOverride: null, brewKeyword: keyword });
    }
  }
  const out: GrandArchiveCardActivationCandidate[] = [];
  for (const method of methods) {
    const imbueDeclarations: readonly (true | undefined)[] = keywords.some(
      (keyword) => keyword.name === "imbue",
    )
      ? [undefined, true]
      : [undefined];
    for (const revealForImbue of imbueDeclarations) {
      const bases = cardAnnouncementCandidates(
        program,
        state,
        playerId,
        sourceId,
        maximumChosenVariableValue,
        limit,
        method.costOverride,
        revealForImbue ? ["imbued"] : undefined,
      );
      for (const base of bases) {
        const evaluation: GrandArchiveEvaluationContext = {
          program,
          state,
          controllerId: playerId,
          sourceId,
          abilityBearerId: sourceId,
          bindings: base.announcement.targets ?? {},
          variables: base.announcement.variables ?? {},
        };
        const ingredientSets = method.brewKeyword
          ? brewIngredientCandidates(method.brewKeyword, evaluation, state, playerId, limit)
          : [undefined];
        for (const optional of optionalCardActivationFields(
          program,
          state,
          playerId,
          sourceId,
          base.announcement,
          method.activationMethod,
          limit,
          revealForImbue,
        )) {
          for (const brewIngredientIds of ingredientSets) {
            out.push({
              ...optional,
              ...base.payment,
              ...(brewIngredientIds ? { brewIngredientIds } : {}),
            });
            if (out.length >= limit) return out;
          }
        }
      }
    }
  }
  return out;
}

function cardHasPotentialActivationOrigin(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  searchPermissionRules: boolean,
): boolean {
  const source = state.objects[sourceId];
  if (!source) return false;
  if (source.controllerId === playerId && source.zone === "hand") return true;
  if (
    source.controllerId === playerId &&
    source.zone === "graveyard" &&
    grandArchiveObjectHasActiveKeyword(program, state, source, "ephemerate")
  ) {
    return true;
  }
  if (!searchPermissionRules) return false;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId,
    abilityBearerId: sourceId,
    candidateId: sourceId,
    bindings: {},
  };
  return (["activate", "play"] as const).some((action) =>
    collectGrandArchiveActionRules({
      action,
      activationKind: "card",
      playerId,
      candidateId: sourceId,
      fromZone: source.zone,
      evaluation,
    }).some((rule) => ruleGrantsPermissionToPlayer(rule, playerId)),
  );
}

function matchMayGrantNonstandardCardActivation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): boolean {
  const permitsActivation = (effect: {
    readonly kind: string;
    readonly mode?: string;
    readonly action?: string;
  }) =>
    effect.kind === "rule-modification" &&
    effect.mode === "allow" &&
    (effect.action === "activate" || effect.action === "play");
  if (state.ruleModifications.some((instance) => permitsActivation(instance.effect))) return true;
  return Object.values(state.objects).some((source) =>
    flattenGrandArchiveAbilities(grandArchiveObjectFace(program, source).abilities).some(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "effects" &&
        ability.effects.some(
          (effect) =>
            permitsActivation(effect) ||
            (effect.kind === "continuous" &&
              (effect.change.kind === "grant-ability" ||
                effect.change.kind === "copy-abilities" ||
                effect.change.kind === "copy-abilities-from-collection")),
        ),
    ),
  );
}

function activatedAbilityAnnouncementCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  ability: GrandArchiveActivatedAbility,
  maximumChosenVariableValue: number,
  limit: number,
): readonly {
  readonly announcement: GrandArchiveAnnouncementCandidate;
  readonly payment: Readonly<Record<string, unknown>>;
}[] {
  const source = state.objects[sourceId];
  if (!source) return [];
  if (!grandArchiveAbilityIsFunctional(grandArchiveObjectFace(program, source), ability, source)) {
    return [];
  }
  const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
  if (!executionObject) return [];
  const cascadeCount = ability.cascade
    ? (executionObject.cascadeCounts[ability.id] ?? 0) + 1
    : undefined;
  const cascadeMode =
    ability.cascade && cascadeCount !== undefined
      ? ability.cascade.modes.find((mode) => mode.counts.includes(cascadeCount))
      : undefined;
  const announcements = announcementCandidates(
    program,
    state,
    playerId,
    executionObject.id,
    () =>
      ability.cascade
        ? {
            variables: [...(ability.variables ?? []), ...(cascadeMode?.variables ?? [])],
            effect: cascadeMode?.effect,
            targets: [...(ability.targets ?? []), ...(cascadeMode?.targets ?? [])],
          }
        : {
            variables: ability.variables,
            modes: ability.modes,
            effect: ability.effect,
            targets: ability.targets,
          },
    { maximumChosenVariableValue, limit },
  );
  const payments = paymentDeclarationCandidates(
    state,
    playerId,
    ability.cost,
    executionObject.id,
    limit,
  );
  const initialEvaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: playerId,
    sourceId: executionObject.id,
    abilityBearerId: executionObject.id,
    abilityId: ability.id,
    bindings: {},
  };
  const abilityIdentity = {
    ...(ability.keyword || ability.label
      ? { keyword: ability.keyword?.name ?? ability.label?.name }
      : {}),
    ...(ability.label ? { label: ability.label.name } : {}),
  };
  const out: {
    readonly announcement: GrandArchiveAnnouncementCandidate;
    readonly payment: Readonly<Record<string, unknown>>;
  }[] = [];
  for (const announcement of announcements) {
    const contributionEvaluation: GrandArchiveEvaluationContext = {
      ...initialEvaluation,
      bindings: announcement.targets ?? {},
      variables: announcement.variables ?? {},
    };
    const contributionSets = paymentContributionDeclarationCandidates(
      {
        action: "pay-cost",
        activationKind: "ability",
        playerId,
        candidateId: executionObject.id,
        fromZone: executionObject.zone,
        abilityIdentity,
        evaluation: contributionEvaluation,
      },
      limit,
    );
    for (const payment of payments) {
      for (const paymentContributions of contributionSets) {
        out.push({
          announcement,
          payment: {
            ...payment,
            ...(paymentContributions.length > 0 ? { paymentContributions } : {}),
          },
        });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

function orderedGlimpsePartitions(
  objectIds: readonly GrandArchiveObjectId[],
  limit: number,
): readonly {
  readonly top: readonly GrandArchiveObjectId[];
  readonly bottom: readonly GrandArchiveObjectId[];
}[] {
  const out: {
    readonly top: readonly GrandArchiveObjectId[];
    readonly bottom: readonly GrandArchiveObjectId[];
  }[] = [];
  for (const order of permutations(objectIds, limit)) {
    for (let split = 0; split <= order.length; split += 1) {
      out.push({ top: order.slice(0, split), bottom: order.slice(split) });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

function aethercallingLoadCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  cardIds: readonly GrandArchiveObjectId[],
  excludedCardId: GrandArchiveObjectId | undefined,
  limit: number,
): readonly (readonly GrandArchiveAethercallingLoad[])[] {
  const weapons = grandArchivePlayerZoneObjectIds(state, playerId, "field").filter((weaponId) => {
    const weapon = state.objects[weaponId];
    if (!weapon || weapon.controllerId !== playerId) return false;
    const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, weapon);
    return (
      characteristics.types.includes("WEAPON") &&
      (characteristics.subtypes.includes("AETHERWING") ||
        grandArchiveObjectHasActiveKeyword(program, state, weapon, "aetherwing"))
    );
  });
  let candidates: readonly (readonly GrandArchiveAethercallingLoad[])[] = [[]];
  for (const cardId of cardIds) {
    if (cardId === excludedCardId) continue;
    const card = state.objects[cardId];
    if (
      !card ||
      card.zone !== "main-deck" ||
      card.ownerId !== playerId ||
      (!grandArchiveObjectHasActiveKeyword(program, state, card, "aethercalling") &&
        !grandArchiveGrantedKeywordsForAction(program, state, playerId, "glimpse", cardId).some(
          (keyword) => keyword.name === "aethercalling",
        ))
    ) {
      continue;
    }
    const choices: readonly (GrandArchiveAethercallingLoad | undefined)[] = [
      undefined,
      ...weapons.map((weaponId) => ({ cardId, weaponId })),
    ];
    const next: (readonly GrandArchiveAethercallingLoad[])[] = [];
    for (const prefix of candidates) {
      for (const choice of choices) {
        next.push(choice ? [...prefix, choice] : prefix);
        if (next.length >= limit) break;
      }
      if (next.length >= limit) break;
    }
    candidates = next;
  }
  return candidates;
}

function interleaveBounded<T>(groups: readonly (readonly T[])[], limit: number): readonly T[] {
  const out: T[] = [];
  for (let index = 0; out.length < limit; index += 1) {
    let appended = false;
    for (const group of groups) {
      const candidate = group[index];
      if (candidate === undefined) continue;
      out.push(candidate);
      appended = true;
      if (out.length >= limit) break;
    }
    if (!appended) break;
  }
  return out;
}

function starcallingKeywords(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  cardId: GrandArchiveObjectId,
): readonly GrandArchiveAlternativeActivationKeyword[] {
  const card = state.objects[cardId];
  if (!card) return [];
  const printed = grandArchiveObjectActiveKeywords(program, state, card).filter(
    (keyword): keyword is GrandArchiveAlternativeActivationKeyword =>
      keyword.name === "starcalling",
  );
  const granted = grandArchiveGrantedKeywordsForAction(
    program,
    state,
    playerId,
    "glimpse",
    cardId,
  ).filter(
    (keyword): keyword is GrandArchiveAlternativeActivationKeyword =>
      keyword.name === "starcalling",
  );
  return [...printed, ...granted];
}

function glimpseAnswerCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  decision: Extract<GrandArchiveDecision, { readonly kind: "resolve-glimpse" }>,
  maximumChosenVariableValue: number,
  limit: number,
): readonly GrandArchiveGlimpseAnswer[] {
  const plainReorders: GrandArchiveGlimpseAnswer[] = [];
  const loadedReorders: GrandArchiveGlimpseAnswer[] = [];
  reorderCandidates: for (const loads of aethercallingLoadCandidates(
    program,
    state,
    decision.playerId,
    decision.cardIds,
    undefined,
    limit,
  )) {
    const reorders = loads.length > 0 ? loadedReorders : plainReorders;
    const loaded = new Set(loads.map((load) => load.cardId));
    const remaining = decision.cardIds.filter((cardId) => !loaded.has(cardId));
    for (const partition of orderedGlimpsePartitions(remaining, limit)) {
      reorders.push({
        kind: "reorder",
        ...(loads.length > 0 ? { loads } : {}),
        top: partition.top,
        bottom: partition.bottom,
      });
      if (reorders.length >= limit) continue reorderCandidates;
    }
  }
  const plainStarcalls: GrandArchiveGlimpseAnswer[] = [];
  const loadedStarcalls: GrandArchiveGlimpseAnswer[] = [];
  starcallingCandidates: for (const cardId of decision.cardIds) {
    for (const keyword of starcallingKeywords(program, state, decision.playerId, cardId)) {
      const card = state.objects[cardId];
      if (!card) continue;
      const imbueDeclarations: readonly (true | undefined)[] = grandArchiveObjectActiveKeywords(
        program,
        state,
        card,
      ).some((activeKeyword) => activeKeyword.name === "imbue")
        ? [undefined, true]
        : [undefined];
      for (const revealForImbue of imbueDeclarations) {
        const bases = cardAnnouncementCandidates(
          program,
          state,
          decision.playerId,
          cardId,
          maximumChosenVariableValue,
          limit,
          keyword.cost,
          revealForImbue ? ["imbued"] : undefined,
        );
        for (const base of bases) {
          const optionals = optionalCardActivationFields(
            program,
            state,
            decision.playerId,
            cardId,
            base.announcement,
            "starcalling",
            limit,
            revealForImbue,
          );
          for (const optional of optionals) {
            const { activationMethod: _activationMethod, ...answerFields } = optional;
            for (const loads of aethercallingLoadCandidates(
              program,
              state,
              decision.playerId,
              decision.cardIds,
              cardId,
              limit,
            )) {
              const starcalls = loads.length > 0 ? loadedStarcalls : plainStarcalls;
              const loaded = new Set(loads.map((load) => load.cardId));
              const otherCards = decision.cardIds.filter(
                (otherId) => otherId !== cardId && !loaded.has(otherId),
              );
              for (const bottom of permutations(otherCards, limit - starcalls.length)) {
                starcalls.push({
                  kind: "starcall",
                  cardId,
                  ...(loads.length > 0 ? { loads } : {}),
                  bottom,
                  ...answerFields,
                  ...base.payment,
                });
                if (starcalls.length >= limit) continue starcallingCandidates;
              }
            }
          }
        }
      }
    }
  }
  return interleaveBounded([plainReorders, loadedReorders, plainStarcalls, loadedStarcalls], limit);
}

function answerLabel(answer: unknown): string {
  if (typeof answer === "boolean") return answer ? "Yes" : "No";
  if (typeof answer === "string") return shortId(answer);
  if (typeof answer === "number") return String(answer);
  if (Array.isArray(answer)) {
    return answer.length === 0 ? "Choose none" : answer.map(String).join(", ");
  }
  return "Submit choice";
}

function decisionAnswerCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  decision: GrandArchiveDecision,
  limit: number,
  maximumChosenVariableValue: number,
): readonly GrandArchiveDecisionAnswerCandidate[] {
  const candidates = (answers: readonly unknown[], label?: (answer: unknown) => string) =>
    answers
      .slice(0, limit)
      .map((answer) => ({ answer, label: label?.(answer) ?? answerLabel(answer) }));
  switch (decision.kind) {
    case "choose-replacement":
      return decision.mode === "order"
        ? candidates(decision.candidateIds, (answer) => `Apply replacement ${String(answer)}`)
        : candidates([true, false], (answer) =>
            answer ? "Apply the optional replacement" : "Decline the optional replacement",
          );
    case "choose-unique-object":
      return candidates(
        decision.candidates,
        (answer) => `Keep ${objectLabel(program, state, answer as GrandArchiveObjectId)}`,
      );
    case "choose-preserve-destination":
      return candidates([true, false], (answer) =>
        answer ? "Preserve in the material deck" : "Banish instead of preserving",
      );
    case "choose-retaliators":
      return candidates(
        combinations(decision.candidates, 0, decision.candidates.length, limit),
        (answer) =>
          (answer as readonly GrandArchiveObjectId[]).length === 0
            ? "Choose no retaliators"
            : `Retaliate with ${(answer as readonly GrandArchiveObjectId[])
                .map((id) => objectLabel(program, state, id))
                .join(" + ")}`,
      );
    case "order-retaliation-damage":
      return candidates(
        permutations(decision.retaliatorIds, limit),
        () => "Order retaliation damage",
      );
    case "resolve-critical":
      return candidates(
        [[], ...combinations(decision.candidates, decision.amount, decision.amount, limit - 1)],
        (answer) =>
          (answer as readonly GrandArchiveObjectId[]).length === 0
            ? "Decline Critical"
            : `Pay Critical with ${(answer as readonly GrandArchiveObjectId[])
                .map((id) => objectLabel(program, state, id))
                .join(" + ")}`,
      );
    case "declare-resolved-attack": {
      const ordinaryTargetSets = combinations(
        decision.targetCandidates,
        Math.min(1, decision.targetCandidates.length),
        decision.targetCandidates.length,
        limit,
      );
      const additionalTargetSets = combinations(
        decision.targetCandidates,
        0,
        decision.targetCandidates.length,
        limit,
      );
      const weaponSets = combinations(
        decision.weaponCandidates,
        0,
        decision.weaponCandidates.length,
        limit,
      );
      const out: GrandArchiveDecisionAnswerCandidate[] = [];
      for (const attackerId of decision.attackerCandidates) {
        for (const weaponIds of weaponSets) {
          const hasCleave = [attackerId, decision.intentId, ...weaponIds].some((objectId) => {
            const object = state.objects[objectId];
            return (
              object !== undefined &&
              grandArchiveObjectHasActiveKeyword(program, state, object, "cleave")
            );
          });
          if (!hasCleave) {
            for (const targetIds of ordinaryTargetSets) {
              for (const delegatePlayerId of [undefined, ...decision.cleavePlayerCandidates]) {
                out.push({
                  answer: {
                    attackerId,
                    targetIds,
                    ...(weaponIds.length > 0 ? { weaponIds } : {}),
                    ...(delegatePlayerId ? { delegatePlayerId } : {}),
                  },
                  label: `Attack with ${objectLabel(program, state, attackerId)}`,
                });
                if (out.length >= limit) return out;
              }
            }
          } else {
            for (const cleavePlayerId of decision.cleavePlayerCandidates) {
              for (const targetIds of additionalTargetSets) {
                out.push({
                  answer: {
                    attackerId,
                    targetIds,
                    ...(weaponIds.length > 0 ? { weaponIds } : {}),
                    cleavePlayerId,
                  },
                  label: `Cleave with ${objectLabel(program, state, attackerId)}`,
                });
                if (out.length >= limit) return out;
              }
            }
          }
        }
      }
      return out;
    }
    case "choose-delegated-defender":
      return candidates(
        decision.candidateIds,
        (answer) => `Defend with ${objectLabel(program, state, answer as GrandArchiveObjectId)}`,
      );
    case "discard-to-influence-limit":
      return candidates(
        combinations(decision.candidateIds, decision.amount, decision.amount, limit),
        () => `Discard ${decision.amount} to the influence limit`,
      );
    case "choose-recollection":
      return candidates(
        combinations(decision.candidateIds, decision.amount, decision.amount, limit),
        () => `Recollect ${decision.amount}`,
      );
    case "order-triggered-abilities":
      return candidates(
        permutations(decision.pendingTriggerIds, limit),
        () => "Order triggered abilities",
      );
    case "announce-triggered-ability": {
      const pending = state.pendingTriggers.find(
        (trigger) => trigger.id === decision.pendingTriggerId,
      );
      if (!pending) return [];
      const evaluation: GrandArchiveEvaluationContext = {
        program,
        state,
        controllerId: pending.controllerId,
        ...(pending.sourceId
          ? {
              sourceId: pending.sourceId,
              abilityBearerId: pending.sourceId,
              sourceIdentityId: pending.sourceId,
              sourceIncarnation: pending.sourceIncarnation,
            }
          : {}),
        ...(pending.sourceLkiEventId
          ? {
              sourceLkiEventId: pending.sourceLkiEventId,
              sourceInformationBasis: "last-known",
            }
          : {}),
        bindings: pending.bindings,
        variables: pending.variables,
      };
      const modeSets = declaredModeCandidates(decision.modes, evaluation, limit);
      const out: GrandArchiveDecisionAnswerCandidate[] = [];
      for (const declaredModes of modeSets) {
        const variableAssignments = chosenVariableAssignments(
          [
            ...(pending.ability.variables ?? []),
            ...declaredModes.modes.flatMap((mode) => mode.variables ?? []),
          ],
          evaluation,
          pending.variables,
          maximumChosenVariableValue,
          limit,
        );
        for (const variables of variableAssignments) {
          const announcementEvaluation = { ...evaluation, variables };
          const declarations = collectGrandArchiveModeTargets(
            decision.baseTargets,
            declaredModes.modes,
          );
          const assignments = targetAssignments(declarations, announcementEvaluation, limit);
          for (const targets of assignments.length > 0 ? assignments : [{}]) {
            out.push({
              answer: {
                ...(declaredModes.ids.length > 0 ? { modeIds: declaredModes.ids } : {}),
                ...(Object.keys(targets).length > 0 ? { targets } : {}),
                ...(Object.keys(variables).length > 0 ? { variables } : {}),
              },
              label: "Announce triggered ability",
            });
            if (out.length >= limit) return out;
          }
        }
      }
      return out;
    }
    case "resolve-optional-effect":
      return candidates([true, false], (answer) =>
        answer ? "Resolve the optional effect" : "Decline the optional effect",
      );
    case "resolve-effect-choice": {
      const evaluation = resolutionEvaluation(program, state);
      return evaluation
        ? candidates(
            resolutionChoiceAnswers(
              program,
              state,
              decision.selection,
              evaluation,
              limit,
              maximumChosenVariableValue,
              decision.mayFailToFind ? { mayFailToFind: true } : {},
            ),
          )
        : [];
    }
    case "retarget-stack-item": {
      const evaluation = resolutionEvaluation(program, state);
      return evaluation
        ? candidates(
            targetAssignments(decision.declarations, evaluation, limit).map((targets) => ({
              targets,
            })),
            () => "Choose new targets",
          )
        : [];
    }
    case "remode-stack-item":
      return candidates(
        decision.choices.map((modeIds) => ({ modeIds })),
        () => "Choose new modes for the copy",
      );
    case "resolve-effect-payment": {
      const directReservePayments = [
        ...state.zones[decision.playerId].hand.flatMap((cardId) =>
          cardId === state.resolution?.sourceId
            ? []
            : [{ reservePayment: [{ kind: "card" as const, cardId }] }],
        ),
        ...grandArchivePlayerZoneObjectIds(state, decision.playerId, "field").map((objectId) => ({
          reservePayment: [{ kind: "reservable" as const, objectId }],
        })),
      ];
      const payments = paymentCandidates(
        state,
        decision.playerId,
        decision.cost,
        state.resolution?.sourceId,
        limit,
      );
      return candidates(
        [...(decision.mayDecline ? [false] : []), ...directReservePayments, ...payments],
        (answer) => (answer === false ? "Decline payment" : "Pay the effect cost"),
      );
    }
    case "resolve-level-up":
      return candidates(
        decision.candidateCardIds,
        (answer) => `Level up with ${objectLabel(program, state, answer as GrandArchiveObjectId)}`,
      );
    case "resolve-direction-choice":
      return candidates(decision.directions, (answer) => `Choose ${String(answer)}`);
    case "resolve-distribution": {
      const evaluation = resolutionEvaluation(program, state);
      if (!evaluation) return [];
      return resolutionChoiceAnswers(
        program,
        state,
        decision.among,
        evaluation,
        limit,
        maximumChosenVariableValue,
      ).flatMap((answer): readonly GrandArchiveDecisionAnswerCandidate[] => {
        if (!Array.isArray(answer) || answer.length === 0 || decision.amount < answer.length)
          return [];
        return [
          {
            answer: {
              allocations: answer.map((objectId, index) => ({
                objectId,
                amount: index === 0 ? decision.amount - answer.length + 1 : 1,
              })),
            },
            label: `Distribute ${decision.amount}`,
          },
        ];
      });
    }
    case "resolve-move-partition": {
      const first = [decision.objectIds, []] as const;
      const second = [[], decision.objectIds] as const;
      const answers =
        decision.objectIds.length > 1
          ? [first, second, [[decision.objectIds[0]!], decision.objectIds.slice(1)]]
          : [first, second];
      return candidates(answers, () => "Partition the moved cards").map((candidate) => ({
        ...candidate,
        answer: { partitions: candidate.answer },
      }));
    }
    case "resolve-counter-allocation": {
      let remaining = decision.minimum;
      const allocations: { readonly objectId: GrandArchiveObjectId; readonly amount: number }[] =
        [];
      for (const candidate of decision.candidates) {
        const amount = Math.min(candidate.available, remaining);
        if (amount > 0) allocations.push({ objectId: candidate.objectId, amount });
        remaining -= amount;
      }
      return remaining === 0
        ? [{ answer: { allocations }, label: `Allocate ${decision.minimum} counters` }]
        : [];
    }
    case "announce-effect-attack": {
      const ordinaryTargetSets = combinations(
        decision.targetCandidates,
        Math.min(1, decision.targetCandidates.length),
        decision.targetCandidates.length,
        limit,
      );
      const additionalTargetSets = combinations(
        decision.targetCandidates,
        0,
        decision.targetCandidates.length,
        limit,
      );
      const weaponSets = combinations(
        decision.weaponCandidates,
        0,
        decision.weaponCandidates.length,
        limit,
      );
      const paymentOptions = decision.cost
        ? paymentCandidates(
            state,
            decision.playerId,
            decision.cost,
            state.resolution?.sourceId,
            limit,
          )
        : [{}];
      const stackItem = state.stack.find((item) => item.id === decision.stackItemId);
      const attackCardId =
        stackItem && "cardId" in stackItem
          ? stackItem.cardId
          : stackItem && "sourceId" in stackItem
            ? stackItem.sourceId
            : undefined;
      const out: GrandArchiveDecisionAnswerCandidate[] = [];
      for (const weaponIds of weaponSets) {
        for (const effectCostPayment of paymentOptions) {
          const hasCleave = [decision.attackerId, attackCardId, ...weaponIds].some((objectId) => {
            if (!objectId) return false;
            const object = state.objects[objectId];
            return (
              object !== undefined &&
              grandArchiveObjectHasActiveKeyword(program, state, object, "cleave")
            );
          });
          if (!hasCleave) {
            for (const targetIds of ordinaryTargetSets) {
              for (const delegatePlayerId of [undefined, ...decision.cleavePlayerCandidates]) {
                out.push({
                  answer: {
                    targetIds,
                    ...(weaponIds.length > 0 ? { weaponIds } : {}),
                    ...(Object.keys(effectCostPayment).length > 0 ? { effectCostPayment } : {}),
                    ...(delegatePlayerId ? { delegatePlayerId } : {}),
                  },
                  label: "Declare the effect-created attack",
                });
                if (out.length >= limit) return out;
              }
            }
          } else {
            for (const cleavePlayerId of decision.cleavePlayerCandidates) {
              for (const targetIds of additionalTargetSets) {
                out.push({
                  answer: {
                    targetIds,
                    ...(weaponIds.length > 0 ? { weaponIds } : {}),
                    ...(Object.keys(effectCostPayment).length > 0 ? { effectCostPayment } : {}),
                    cleavePlayerId,
                  },
                  label: "Declare the effect-created Cleave attack",
                });
                if (out.length >= limit) return out;
              }
            }
          }
        }
      }
      return out;
    }
    case "announce-effect-materialization": {
      const announcements = cardAnnouncementCandidates(
        program,
        state,
        decision.playerId,
        decision.cardId,
        maximumChosenVariableValue,
        limit,
        decision.payCosts ? undefined : null,
      ).map((candidate) => ({
        answer: { ...candidate.announcement, ...candidate.payment },
        label: "Materialize the selected card",
      }));
      return decision.attemptBinding
        ? [{ answer: false, label: "Do not materialize" }, ...announcements].slice(0, limit)
        : announcements;
    }
    case "announce-effect-activation":
      return cardAnnouncementCandidates(
        program,
        state,
        decision.playerId,
        decision.cardId,
        maximumChosenVariableValue,
        limit,
        decision.payCosts ? undefined : null,
      ).map((candidate) => ({
        answer: { ...candidate.announcement, ...candidate.payment },
        label: "Activate the selected card",
      }));
    case "resolve-glimpse":
      return candidates(
        glimpseAnswerCandidates(program, state, decision, maximumChosenVariableValue, limit),
        (answer) =>
          (answer as GrandArchiveGlimpseAnswer).kind === "starcall"
            ? `Starcall ${objectLabel(
                program,
                state,
                (answer as Extract<GrandArchiveGlimpseAnswer, { readonly kind: "starcall" }>)
                  .cardId,
              )}`
            : "Order glimpsed cards",
      );
    default:
      return assertNever(decision);
  }
}

export function listGrandArchiveLegalMoves(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): readonly GrandArchiveMoveName[] {
  const player = state.players[playerId];
  if (!player || player.lost || state.status === "finished") return [];
  if (state.decision) {
    return state.decision.playerId === playerId
      ? (["answer-decision", "concede"] as const)
      : (["concede"] as const);
  }
  if (state.status === "pregame") {
    const pregame = state.pregame;
    if (
      pregame?.stage === "player-actions" &&
      state.turnOrder[pregame.currentPlayerIndex] === playerId
    ) {
      return ["bestow-boon", "start-pregame-card", "complete-pregame-actions", "concede"];
    }
    return ["concede"];
  }
  const moves: GrandArchiveMoveName[] = ["concede"];
  if (
    state.turn.playerId === playerId &&
    state.turn.phase === "materialize" &&
    state.turn.materializeChoicePending
  ) {
    moves.push("materialize", "skip-materialization");
    if (
      state.zones[playerId]["material-deck"].some(
        (objectId) => state.objects[objectId]?.states.has("preserved") === true,
      )
    ) {
      moves.push("return-preserved-card");
    }
  }
  if (state.opportunity?.holderId === playerId) {
    moves.push("pass", "activate-card", "activate-ability", "bestow-boon");
    if (
      state.turn.playerId === playerId &&
      state.turn.phase === "main" &&
      state.stack.length === 0
    ) {
      moves.push("declare-attack");
    }
  }
  return moves;
}

/**
 * Expands legal move names into commands that have been executed successfully
 * against an isolated runtime rooted at the exact supplied state. Consumers
 * never need to infer legality from card text or from the shape of a decision.
 */
export function listGrandArchiveLegalCommands(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  options: ListGrandArchiveLegalCommandsOptions = {},
): readonly GrandArchiveLegalCommand[] {
  const moveNames = listGrandArchiveLegalMoves(state, playerId);
  if (moveNames.length === 0) return [];
  const limit = options.maximumDecisionCandidates ?? 256;
  const maximumChosenVariableValue = options.maximumChosenVariableValue ?? 20;
  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("maximumDecisionCandidates must be a positive safe integer");
  }
  if (!Number.isSafeInteger(maximumChosenVariableValue) || maximumChosenVariableValue < 0) {
    throw new Error("maximumChosenVariableValue must be a non-negative safe integer");
  }
  const out: GrandArchiveLegalCommand[] = [];
  const seen = new Set<string>();
  const probeRuntime = new GrandArchiveMatchRuntime(program, state);
  const push = (command: GrandArchiveCommand, label: string): boolean => {
    const key = JSON.stringify(command);
    if (seen.has(key)) return false;
    const probe = probeRuntime.probe(command, {
      playerId,
      expectedStateVersion: state.stateVersion,
    });
    if (!probe.ok) return false;
    seen.add(key);
    out.push({ playerId, stateVersion: state.stateVersion, command, label });
    return true;
  };
  const acceptedReserveUnitsByDeclaration = new Map<string, number>();
  const pushActivation = (
    command: Extract<
      GrandArchiveCommand,
      {
        readonly move: "activate-card" | "activate-ability" | "bestow-boon" | "materialize";
      }
    >,
    label: string,
  ): boolean => {
    const { reservePayment, ...declaration } = command;
    const declarationKey = JSON.stringify(declaration);
    const reserveUnits = reservePayment?.length ?? 0;
    const acceptedReserveUnits = acceptedReserveUnitsByDeclaration.get(declarationKey);
    if (acceptedReserveUnits !== undefined && acceptedReserveUnits !== reserveUnits) return false;
    if (push(command, label)) {
      // A completed quote has exactly one reserve-unit count. Preserve every
      // identity-level payment choice at that count, but stop replaying the
      // same declaration with impossible underpayments and overpayments.
      acceptedReserveUnitsByDeclaration.set(declarationKey, reserveUnits);
      return true;
    }
    return false;
  };

  if (moveNames.includes("concede") && options.includeConcede) {
    push({ move: "concede" }, "Concede");
  }
  const decision = state.decision;
  if (decision) {
    if (decision.playerId !== playerId) return out;
    for (const candidate of decisionAnswerCandidates(
      program,
      state,
      decision,
      limit,
      maximumChosenVariableValue,
    )) {
      push(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: candidate.answer,
        },
        candidate.label,
      );
    }
    return out;
  }

  if (moveNames.includes("pass")) push({ move: "pass" }, "Pass");
  if (moveNames.includes("skip-materialization")) {
    push({ move: "skip-materialization" }, "Skip materialization");
  }
  if (moveNames.includes("complete-pregame-actions")) {
    push({ move: "complete-pregame-actions" }, "Complete pre-game actions");
  }
  if (moveNames.includes("start-pregame-card")) {
    for (const cardId of state.zones[playerId]["material-deck"]) {
      const object = state.objects[cardId];
      if (!object) continue;
      const face = grandArchiveObjectFace(program, object);
      const mayStartOnField = flattenGrandArchiveAbilities(face.abilities).some(
        (ability) =>
          ability.kind === "game-setup" &&
          ability.rule.kind === "optional-start-on-field" &&
          ability.rule.from === "material-deck" &&
          ability.rule.condition === "source-in-starting-deck",
      );
      if (!mayStartOnField) continue;
      push(
        { move: "start-pregame-card", cardId: object.id },
        `Start ${objectLabel(program, state, object.id)}`,
      );
    }
  }
  if (moveNames.includes("materialize")) {
    for (const cardId of state.zones[playerId]["material-deck"]) {
      for (const candidate of cardAnnouncementCandidates(
        program,
        state,
        playerId,
        cardId,
        maximumChosenVariableValue,
        limit,
      )) {
        const command = {
          move: "materialize" as const,
          cardId,
          ...candidate.announcement,
          ...candidate.payment,
        };
        pushActivation(command, `Materialize ${objectLabel(program, state, cardId)}`);
      }
    }
  }
  if (moveNames.includes("return-preserved-card")) {
    for (const cardId of state.zones[playerId]["material-deck"]) {
      if (!state.objects[cardId]?.states.has("preserved")) continue;
      push(
        { move: "return-preserved-card", cardId },
        `Return ${objectLabel(program, state, cardId)} instead of materializing`,
      );
    }
  }
  if (moveNames.includes("activate-card")) {
    const searchPermissionRules = matchMayGrantNonstandardCardActivation(program, state);
    for (const object of Object.values(state.objects)) {
      if (
        !cardHasPotentialActivationOrigin(
          program,
          state,
          playerId,
          object.id,
          searchPermissionRules,
        )
      ) {
        continue;
      }
      const face = grandArchiveObjectFace(program, object);
      const isAttack = face.typeLine.types.includes("ATTACK");
      const attackerIds = isAttack
        ? grandArchivePlayerZoneObjectIds(state, playerId, "field")
        : [undefined];
      for (const candidate of cardActivationCandidates(
        program,
        state,
        playerId,
        object.id,
        maximumChosenVariableValue,
        limit,
      )) {
        for (const attackAttackerId of attackerIds) {
          pushActivation(
            {
              move: "activate-card",
              cardId: object.id,
              ...(attackAttackerId ? { attackAttackerId } : {}),
              ...candidate,
            },
            `Activate ${objectLabel(program, state, object.id)}`,
          );
        }
      }
    }
  }
  if (moveNames.includes("activate-ability")) {
    for (const object of Object.values(state.objects)) {
      for (const ability of grandArchiveObjectActiveAbilities(program, state, object)) {
        if (ability.kind !== "activated") continue;
        for (const candidate of activatedAbilityAnnouncementCandidates(
          program,
          state,
          playerId,
          object.id,
          ability,
          maximumChosenVariableValue,
          limit,
        )) {
          pushActivation(
            {
              move: "activate-ability",
              sourceId: object.id,
              abilityId: ability.id,
              ...candidate.announcement,
              ...candidate.payment,
            },
            `Activate ${objectLabel(program, state, object.id)} — ${ability.text}`,
          );
        }
      }
    }
  }
  if (moveNames.includes("bestow-boon")) {
    for (const cardId of state.zones[playerId].pantheon) {
      const object = state.objects[cardId];
      if (!object || object.facing !== "face-down") continue;
      const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
      if (
        !characteristics.types.includes("LESSER BOON") &&
        !characteristics.types.includes("GREATER BOON")
      ) {
        continue;
      }
      for (const candidate of cardAnnouncementCandidates(
        program,
        state,
        playerId,
        object.id,
        maximumChosenVariableValue,
        limit,
      )) {
        pushActivation(
          {
            move: "bestow-boon",
            cardId: object.id,
            ...candidate.announcement,
            ...candidate.payment,
          },
          `Bestow ${objectLabel(program, state, object.id)}`,
        );
      }
    }
  }
  if (moveNames.includes("declare-attack")) {
    const attackers = grandArchivePlayerZoneObjectIds(state, playerId, "field");
    const targets = Object.values(state.objects).filter(
      (object) => object.zone === "field" && object.controllerId !== playerId,
    );
    const weapons = Object.values(state.objects).filter(
      (object) => object.zone === "field" && object.controllerId === playerId,
    );
    const targetSets = combinations(
      targets.map((target) => target.id),
      0,
      targets.length,
      limit,
    );
    const weaponSets = combinations(
      weapons.map((weapon) => weapon.id),
      0,
      weapons.length,
      limit,
    );
    const playerDeclarations: readonly (
      | Readonly<Record<never, never>>
      | { readonly cleavePlayerId: GrandArchivePlayerId }
      | { readonly delegatePlayerId: GrandArchivePlayerId }
    )[] = [
      {},
      ...state.turnOrder
        .filter((candidate) => candidate !== playerId && state.players[candidate]?.lost === false)
        .flatMap((candidate) => [{ cleavePlayerId: candidate }, { delegatePlayerId: candidate }]),
    ];
    const attackCardIds: readonly (GrandArchiveObjectId | undefined)[] = [
      undefined,
      ...state.zones[playerId].intent,
    ];
    for (const attackerId of attackers) {
      for (const targetIds of targetSets) {
        for (const weaponIds of weaponSets) {
          for (const attackCardId of attackCardIds) {
            for (const playerDeclaration of playerDeclarations) {
              push(
                {
                  move: "declare-attack",
                  attackerId,
                  targetIds,
                  ...(attackCardId ? { attackCardId } : {}),
                  ...(weaponIds.length > 0 ? { weaponIds } : {}),
                  ...playerDeclaration,
                },
                `Attack with ${objectLabel(program, state, attackerId)}`,
              );
              if (out.length >= limit) return out;
            }
          }
        }
      }
    }
  }
  return out;
}
