import { interactionValueMatches, stableDeclarationValue } from "./interaction-values.ts";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionAction,
  type InteractionInput,
  type InteractionIntent,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import {
  describeGrandArchiveStructuredDecision,
  listGrandArchiveDecisionAnswerCandidates,
  listGrandArchiveLegalCommands,
  readGrandArchiveWaitState,
  type GrandArchiveCommand,
  type GrandArchiveDecisionAnswerCandidate,
  type GrandArchiveLegalCommand,
  type GrandArchiveMatchRuntime,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";

type GrandArchiveDecision = NonNullable<GrandArchiveMatchRuntime["state"]["decision"]>;

interface GrandArchiveDecisionPresentation {
  readonly title: string;
  readonly instruction: string;
  readonly intent: InteractionIntent;
}

function decisionPresentation(decision: GrandArchiveDecision): GrandArchiveDecisionPresentation {
  switch (decision.kind) {
    case "choose-replacement":
      return {
        title: "Replacement effect",
        instruction:
          decision.mode === "order"
            ? "Choose which replacement effect applies next."
            : "Choose whether to apply the optional replacement effect.",
        intent: "choose-option",
      };
    case "choose-unique-object":
      return {
        title: "Unique object",
        instruction: "Choose the object that remains on the field.",
        intent: "choose-targets",
      };
    case "choose-preserve-destination":
      return {
        title: "Preserve",
        instruction: "Choose whether this card is preserved or banished.",
        intent: "choose-option",
      };
    case "choose-retaliators":
      return {
        title: "Retaliation",
        instruction: "Choose any units that will retaliate.",
        intent: "choose-targets",
      };
    case "order-retaliation-damage":
      return {
        title: "Retaliation damage",
        instruction: "Put the retaliators in damage order.",
        intent: "order-cards",
      };
    case "resolve-critical":
      return {
        title: "Critical",
        instruction: "Choose whether and how to pay the Critical cost.",
        intent: "custom",
      };
    case "declare-resolved-attack":
    case "announce-effect-attack":
      return {
        title: "Declare attack",
        instruction: "Choose the attacker, targets, weapons, and any required payment.",
        intent: "attack",
      };
    case "choose-delegated-defender":
      return {
        title: "Choose defender",
        instruction: "Choose the unit that will defend this attack.",
        intent: "choose-targets",
      };
    case "discard-to-influence-limit":
      return {
        title: "Influence limit",
        instruction: `Choose ${decision.amount} card${decision.amount === 1 ? "" : "s"} to discard.`,
        intent: "choose-targets",
      };
    case "choose-recollection":
      return {
        title: "Recollection",
        instruction: `Choose ${decision.amount} card${decision.amount === 1 ? "" : "s"} to recollect.`,
        intent: "choose-targets",
      };
    case "announce-triggered-ability":
      return {
        title: "Triggered ability",
        instruction: "Choose modes, targets, and announced values for this trigger.",
        intent: "activate",
      };
    case "order-triggered-abilities":
      return {
        title: "Triggered abilities",
        instruction: "Choose the order in which these triggered abilities enter the Effects Stack.",
        intent: "order-cards",
      };
    case "resolve-optional-effect":
      return {
        title: "Optional effect",
        instruction: "Choose whether to resolve this optional effect.",
        intent: "choose-option",
      };
    case "resolve-effect-choice":
      return {
        title: "Resolve effect",
        instruction: "Make the choice required by the resolving effect.",
        intent: "choose-targets",
      };
    case "retarget-stack-item":
      return {
        title: "Choose new targets",
        instruction: "Choose the new legal targets for this Effects Stack item.",
        intent: "choose-targets",
      };
    case "remode-stack-item":
      return {
        title: "Choose new modes",
        instruction: "Choose the modes for this Effects Stack item.",
        intent: "choose-option",
      };
    case "resolve-effect-payment":
      return {
        title: "Effect payment",
        instruction: "Choose how to pay the effect cost.",
        intent: "custom",
      };
    case "resolve-level-up":
      return {
        title: "Level up",
        instruction: "Choose the champion card used to level up.",
        intent: "choose-targets",
      };
    case "resolve-direction-choice":
      return {
        title: "Choose a direction",
        instruction: "Choose a direction for the effect.",
        intent: "choose-option",
      };
    case "resolve-distribution":
      return {
        title: "Distribute amount",
        instruction: `Distribute ${decision.amount} among the eligible objects.`,
        intent: "choose-option",
      };
    case "resolve-move-partition":
      return {
        title: "Separate cards",
        instruction: "Assign every card to one of the two groups.",
        intent: "move-card",
      };
    case "resolve-counter-allocation":
      return {
        title: "Allocate counters",
        instruction: `Allocate at least ${decision.minimum} counters among the eligible objects.`,
        intent: "choose-option",
      };
    case "announce-effect-materialization":
      return {
        title: "Materialize card",
        instruction: "Choose the announcement and payment for this materialization.",
        intent: "play-card",
      };
    case "announce-effect-activation":
      return {
        title: "Activate card",
        instruction: "Choose the modes, targets, values, and payment for this activation.",
        intent: "play-card",
      };
    case "resolve-glimpse":
      return {
        title: "Glimpse",
        instruction: "Order the glimpsed cards or choose an eligible card to Starcall.",
        intent: "order-cards",
      };
  }
}

export interface GrandArchiveInteractionProjection {
  readonly view: EngineInteractionView;
  readonly commandsByActionId: ReadonlyMap<string, readonly GrandArchiveLegalCommand[]>;
}

function intentForCommand(command: GrandArchiveCommand): InteractionIntent {
  switch (command.move) {
    case "activate-card":
    case "start-pregame-card":
      return "play-card";
    case "materialize":
    case "bestow-boon":
    case "return-preserved-card":
      return "move-card";
    case "activate-ability":
      return "activate";
    case "declare-attack":
      return "attack";
    case "answer-decision":
      return "choose-option";
    case "pass":
    case "skip-materialization":
    case "complete-pregame-actions":
      return "pass";
    case "concede":
      return "concede";
  }
}

function collectReferencedObjects(
  value: unknown,
  objectIds: ReadonlySet<string>,
  found: Set<string>,
) {
  if (typeof value === "string") {
    if (objectIds.has(value)) found.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectReferencedObjects(entry, objectIds, found));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectReferencedObjects(entry, objectIds, found));
  }
}

export function grandArchiveCommandIncarnations(
  runtime: GrandArchiveMatchRuntime,
  command: GrandArchiveCommand,
): Readonly<Record<string, number>> {
  const objectIds = new Set(Object.keys(runtime.state.objects));
  const referenced = new Set<string>();
  collectReferencedObjects(command, objectIds, referenced);
  return Object.fromEntries(
    [...referenced]
      .sort()
      .map((id) => [id, runtime.state.objects[id as GrandArchiveObjectId]?.incarnation ?? -1]),
  );
}

function sourceId(command: GrandArchiveCommand): string | undefined {
  switch (command.move) {
    case "activate-card":
    case "materialize":
    case "bestow-boon":
    case "start-pregame-card":
    case "return-preserved-card":
      return command.cardId;
    case "activate-ability":
      return command.sourceId;
    case "declare-attack":
      return command.attackerId;
    case "pass":
    case "concede":
    case "skip-materialization":
    case "complete-pregame-actions":
    case "answer-decision":
      return undefined;
  }
}

function objectChoiceLabel(runtime: GrandArchiveMatchRuntime, id: string): string {
  const player = runtime.state.players[grandArchivePlayerId(id)];
  if (player) return player.name;
  const object = runtime.state.objects[id as GrandArchiveObjectId];
  if (!object) return id;
  const card = runtime.program.cardsById[object.activeDefinitionId ?? object.definitionId];
  const name = card
    ? card.layout.kind === "single-faced"
      ? card.layout.face.name
      : card.layout.defaultFace.name
    : object.definitionId;
  return `${name} (${id})`;
}

function declarationValueLabel(runtime: GrandArchiveMatchRuntime, value: unknown): string {
  if (typeof value === "string") return objectChoiceLabel(runtime, value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((entry) => declarationValueLabel(runtime, entry)).join(", ")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .map(([key, entry]) => `${key}: ${declarationValueLabel(runtime, entry)}`)
      .join(", ")}}`;
  }
  return String(value);
}

function commandChoiceLabel(
  runtime: GrandArchiveMatchRuntime,
  legal: GrandArchiveLegalCommand,
): string {
  const command = legal.command;
  if (
    command.move !== "activate-card" &&
    command.move !== "activate-ability" &&
    command.move !== "materialize" &&
    command.move !== "bestow-boon"
  ) {
    return legal.label;
  }
  const details: string[] = [];
  if (command.targets) {
    const targets = Object.values(command.targets).flat();
    if (targets.length > 0) {
      details.push(`targets: ${targets.map((id) => objectChoiceLabel(runtime, id)).join(", ")}`);
    }
  }
  if (command.modeIds?.length) details.push(`modes: ${command.modeIds.join(", ")}`);
  if (command.variables && Object.keys(command.variables).length > 0) {
    details.push(
      Object.entries(command.variables)
        .map(([symbol, value]) => `${symbol}=${value}`)
        .join(", "),
    );
  }
  const payments = [
    ...(command.reservePayment ?? []).map((payment) =>
      objectChoiceLabel(runtime, payment.kind === "card" ? payment.cardId : payment.objectId),
    ),
    ...(command.costSelections ?? []).flat().map((id) => objectChoiceLabel(runtime, id)),
  ];
  if (payments.length > 0) details.push(`payment: ${payments.join(", ")}`);
  if (command.costOptionIndex !== undefined)
    details.push(`cost option ${command.costOptionIndex + 1}`);
  if (command.payOptionalCost !== undefined) {
    details.push(command.payOptionalCost ? "optional cost paid" : "optional cost declined");
  }
  const describedFields = new Set([
    "move",
    "cardId",
    "sourceId",
    "abilityId",
    "targets",
    "modeIds",
    "variables",
    "reservePayment",
    "costSelections",
    "costOptionIndex",
    "payOptionalCost",
  ]);
  for (const [key, value] of Object.entries(command)) {
    if (!describedFields.has(key)) {
      details.push(`${key}: ${declarationValueLabel(runtime, value)}`);
    }
  }
  return details.length > 0 ? `${legal.label} · ${details.join(" · ")}` : legal.label;
}

function commandChoiceGroupKey(command: GrandArchiveCommand): string | null {
  switch (command.move) {
    case "activate-card":
      return `activate-card:${command.cardId}`;
    case "activate-ability":
      return `activate-ability:${command.sourceId}:${command.abilityId}`;
    case "materialize":
      return `materialize:${command.cardId}`;
    case "bestow-boon":
      return `bestow-boon:${command.cardId}`;
    case "answer-decision":
      return `answer-decision:${command.decisionId}`;
    case "declare-attack":
      return "declare-attack";
    default:
      return null;
  }
}

type GrandArchiveDeclarationCommand = Extract<
  GrandArchiveCommand,
  { readonly move: "activate-card" | "activate-ability" | "materialize" | "bestow-boon" }
>;

function isDeclarationCommand(
  command: GrandArchiveCommand,
): command is GrandArchiveDeclarationCommand {
  return (
    command.move === "activate-card" ||
    command.move === "activate-ability" ||
    command.move === "materialize" ||
    command.move === "bestow-boon"
  );
}

function declarationEntityField(
  command: GrandArchiveDeclarationCommand,
  field: "brewIngredientIds" | "kindleCardIds" | "floatingMemoryCardIds",
): readonly string[] {
  switch (field) {
    case "brewIngredientIds":
      return command.move === "activate-card" ? (command.brewIngredientIds ?? []) : [];
    case "kindleCardIds":
      return command.move === "activate-card" ? (command.kindleCardIds ?? []) : [];
    case "floatingMemoryCardIds":
      return command.move === "activate-card" || command.move === "materialize"
        ? (command.floatingMemoryCardIds ?? [])
        : [];
  }
}

function declarationSubmissionValues(
  command: GrandArchiveDeclarationCommand,
): Readonly<Record<string, InteractionSubmissionValue>> {
  const values: Record<string, InteractionSubmissionValue> = {};
  if (command.payOptionalCost !== undefined) values["pay-optional-cost"] = command.payOptionalCost;
  if (command.costOptionIndex !== undefined)
    values["cost-option"] = [String(command.costOptionIndex)];
  if ("activationMethod" in command && command.activationMethod)
    values["activation-method"] = [command.activationMethod];
  for (const symbol of ["X", "Y", "Z"] as const) {
    const amount = command.variables?.[symbol];
    if (amount !== undefined) values[`variable:${symbol}`] = amount;
  }
  if (command.modeIds !== undefined) values.modes = [...command.modeIds];
  for (const [binding, targets] of Object.entries(command.targets ?? {}))
    values[`target:${binding}`] = [...targets];
  if (command.reservePayment !== undefined) {
    values["reserve-payment"] = command.reservePayment.map((payment) =>
      payment.kind === "card" ? payment.cardId : payment.objectId,
    );
  }
  command.costSelections?.forEach((selection, index) => {
    values[`additional-cost:${index}`] = [...selection];
  });
  if (command.costPaymentOrders !== undefined)
    values["cost-order"] = [stableDeclarationValue(command.costPaymentOrders)];
  for (const field of ["brewIngredientIds", "kindleCardIds", "floatingMemoryCardIds"] as const) {
    const selection = declarationEntityField(command, field);
    if (selection.length > 0) values[`additional:${field}`] = [...selection];
  }
  return values;
}

function declarationChoicesAreCorrelated(
  commands: readonly GrandArchiveDeclarationCommand[],
): boolean {
  const records = commands.map(declarationSubmissionValues);
  const inputIds = [...new Set(records.flatMap((record) => Object.keys(record)))];
  let combinations = 1;
  for (const inputId of inputIds) {
    const distinct = new Set(
      records.map((record) => stableDeclarationValue(record[inputId] ?? null)),
    ).size;
    combinations *= distinct;
    if (combinations > commands.length) return true;
  }
  return false;
}

function exactDeclarationInput(
  runtime: GrandArchiveMatchRuntime,
  entries: readonly GrandArchiveLegalCommand[],
): InteractionInput {
  return {
    id: "legal-declaration",
    kind: "option-selection",
    text: { key: "Choose a legal declaration." },
    required: true,
    min: 1,
    max: 1,
    options: entries.map((entry) => ({
      id: stableDeclarationValue(entry.command),
      text: { key: commandChoiceLabel(runtime, entry) },
      enabled: true,
    })),
  };
}

function structuredDeclarationInputs(
  runtime: GrandArchiveMatchRuntime,
  entries: readonly GrandArchiveLegalCommand[],
): InteractionInput[] | null {
  const commands = entries.flatMap((entry) =>
    isDeclarationCommand(entry.command) ? [entry.command] : [],
  );
  if (commands.length !== entries.length) return null;
  const hasUnprojectedDeclarationField = commands.some(
    (command) =>
      ("prepareAbilityIndexes" in command && command.prepareAbilityIndexes !== undefined) ||
      ("revealForImbue" in command && command.revealForImbue !== undefined) ||
      command.paymentContributions !== undefined,
  );
  if (hasUnprojectedDeclarationField || declarationChoicesAreCorrelated(commands)) {
    return [exactDeclarationInput(runtime, entries)];
  }
  const inputs: InteractionInput[] = [];
  // The engine enumerates these selections as combinations. Cost-component order is
  // represented separately by costPaymentOrders, not by the order cards are clicked.
  const addEntitySelection = (
    id: string,
    text: string,
    role: "target" | "cost",
    selections: readonly (readonly string[])[],
    ordered = false,
  ) => {
    const candidateIds = [...new Set(selections.flat())];
    if (candidateIds.length === 0) return;
    inputs.push({
      id,
      kind: "entity-selection",
      role,
      text: { key: text },
      required: Math.min(...selections.map((selection) => selection.length)) > 0,
      entityKinds: [
        ...new Set(candidateIds.map((candidateId) => entityKindForId(runtime, candidateId))),
      ],
      min: Math.min(...selections.map((selection) => selection.length)),
      max: Math.max(...selections.map((selection) => selection.length)),
      ordered,
      candidates: candidateIds.map((candidateId) => ({
        entity: entityRefForId(runtime, candidateId),
        text: { key: structuredCandidateLabel(runtime, candidateId) },
        enabled: true,
      })),
    });
  };
  const addOptions = (id: string, text: string, values: readonly (readonly string[])[]) => {
    const optionIds = [...new Set(values.flat())];
    if (optionIds.length === 0) return;
    inputs.push({
      id,
      kind: "option-selection",
      text: { key: text },
      required: Math.min(...values.map((value) => value.length)) > 0,
      min: Math.min(...values.map((value) => value.length)),
      max: Math.max(...values.map((value) => value.length)),
      options: optionIds.map((optionId) => ({
        id: optionId,
        text: { key: optionId },
        enabled: true,
      })),
    });
  };

  const optionalValues = [...new Set(commands.map((command) => command.payOptionalCost))];
  if (optionalValues.some((value) => value !== undefined)) {
    inputs.push({
      id: "pay-optional-cost",
      kind: "boolean",
      text: { key: "Pay the optional cost?" },
      required: true,
      trueText: { key: "Pay optional cost" },
      falseText: { key: "Decline optional cost" },
    });
  }
  const costOptions = [...new Set(commands.flatMap((command) => command.costOptionIndex ?? []))];
  if (costOptions.length > 0) {
    inputs.push({
      id: "cost-option",
      kind: "option-selection",
      text: { key: "Choose a cost." },
      required: true,
      min: 1,
      max: 1,
      options: costOptions.map((value) => ({
        id: String(value),
        text: { key: `Cost option ${value + 1}` },
        enabled: true,
      })),
    });
  }
  const activationMethods = commands.flatMap((command) =>
    "activationMethod" in command && command.activationMethod ? [[command.activationMethod]] : [[]],
  );
  addOptions("activation-method", "Choose an activation method.", activationMethods);

  for (const symbol of ["X", "Y", "Z"] as const) {
    const values = commands.flatMap((command) => command.variables?.[symbol] ?? []);
    if (values.length === 0) continue;
    inputs.push({
      id: `variable:${symbol}`,
      kind: "number",
      text: { key: `Choose ${symbol}.` },
      required: true,
      min: Math.min(...values),
      max: Math.max(...values),
      step: 1,
    });
  }
  addOptions(
    "modes",
    "Choose modes.",
    commands.map((command) => command.modeIds ?? []),
  );
  const bindings = [...new Set(commands.flatMap((command) => Object.keys(command.targets ?? {})))];
  for (const binding of bindings) {
    addEntitySelection(
      `target:${binding}`,
      `Choose ${binding.replaceAll("-", " ")}.`,
      "target",
      commands.map((command) => command.targets?.[binding] ?? []),
    );
  }
  addEntitySelection(
    "reserve-payment",
    "Choose reserve payment sources.",
    "cost",
    commands.map((command) =>
      (command.reservePayment ?? []).map((payment) =>
        payment.kind === "card" ? payment.cardId : payment.objectId,
      ),
    ),
  );
  const costSelectionCount = Math.max(
    0,
    ...commands.map((command) => command.costSelections?.length ?? 0),
  );
  for (let index = 0; index < costSelectionCount; index += 1) {
    addEntitySelection(
      `additional-cost:${index}`,
      `Choose cards for additional cost ${index + 1}.`,
      "cost",
      commands.map((command) => command.costSelections?.[index] ?? []),
    );
  }
  if (commands.some((command) => command.costPaymentOrders?.length)) {
    const orders = [
      ...new Map(
        commands.map((command) => {
          const value = command.costPaymentOrders ?? [];
          return [stableDeclarationValue(value), value] as const;
        }),
      ).entries(),
    ];
    inputs.push({
      id: "cost-order",
      kind: "option-selection",
      text: { key: "Choose the cost payment order." },
      required: true,
      min: 1,
      max: 1,
      options: orders.map(([id], index) => ({
        id,
        text: { key: `Payment order ${index + 1}` },
        enabled: true,
      })),
    });
  }
  for (const [field, label] of [
    ["brewIngredientIds", "Choose Brew ingredients."],
    ["kindleCardIds", "Choose cards for Kindle."],
    ["floatingMemoryCardIds", "Choose Floating Memory cards."],
  ] as const) {
    addEntitySelection(
      `additional:${field}`,
      label,
      "cost",
      commands.map((command) => declarationEntityField(command, field)),
    );
  }
  return inputs.length > 0 ? inputs : null;
}

type GrandArchiveAttackCommand = Extract<GrandArchiveCommand, { readonly move: "declare-attack" }>;

function structuredAttackInputs(
  runtime: GrandArchiveMatchRuntime,
  entries: readonly GrandArchiveLegalCommand[],
): InteractionInput[] | null {
  const commands = entries.flatMap((entry) =>
    entry.command.move === "declare-attack" ? [entry.command] : [],
  );
  if (commands.length !== entries.length) return null;
  const selection = (
    id: string,
    role: "attacker" | "defender" | "cost",
    text: string,
    values: readonly (readonly string[])[],
    ordered = false,
  ): InteractionInput | null => {
    const candidates = [...new Set(values.flat())];
    if (candidates.length === 0) return null;
    return {
      id,
      kind: "entity-selection",
      role,
      text: { key: text },
      required: Math.min(...values.map((value) => value.length)) > 0,
      entityKinds: [...new Set(candidates.map((candidate) => entityKindForId(runtime, candidate)))],
      min: Math.min(...values.map((value) => value.length)),
      max: Math.max(...values.map((value) => value.length)),
      ordered,
      candidates: candidates.map((candidate) => ({
        entity: entityRefForId(runtime, candidate),
        text: { key: structuredCandidateLabel(runtime, candidate) },
        enabled: true,
      })),
    };
  };
  const inputs = [
    selection(
      "attacker",
      "attacker",
      "Choose the attacker.",
      commands.map((command) => [command.attackerId]),
    ),
    selection(
      "weapons",
      "attacker",
      "Choose wielded weapons or objects.",
      commands.map((command) => command.weaponIds ?? []),
    ),
    selection(
      "attack-targets",
      "defender",
      "Choose defending targets.",
      commands.map((command) => command.targetIds),
    ),
    selection(
      "delegated-player",
      "defender",
      "Choose the opponent who will defend.",
      commands.map((command) => (command.delegatePlayerId ? [command.delegatePlayerId] : [])),
    ),
    selection(
      "cleave-player",
      "defender",
      "Choose the player hit by Cleave.",
      commands.map((command) => (command.cleavePlayerId ? [command.cleavePlayerId] : [])),
    ),
    selection(
      "attack-payment",
      "cost",
      "Choose declaration-cost payment sources.",
      commands.map((command) =>
        (command.reservePayment ?? []).map((payment) =>
          payment.kind === "card" ? payment.cardId : payment.objectId,
        ),
      ),
    ),
  ].filter((input): input is InteractionInput => input !== null);
  const costOptions = [...new Set(commands.flatMap((command) => command.costOptionIndex ?? []))];
  if (costOptions.length > 0) {
    inputs.push({
      id: "attack-cost-option",
      kind: "option-selection",
      text: { key: "Choose the declaration cost." },
      required: true,
      min: 1,
      max: 1,
      options: costOptions.map((option) => ({
        id: String(option),
        text: { key: `Cost option ${option + 1}` },
        enabled: true,
      })),
    });
  }
  return inputs;
}

function groupLegalCommands(
  legal: readonly GrandArchiveLegalCommand[],
): readonly (readonly GrandArchiveLegalCommand[])[] {
  const groups: GrandArchiveLegalCommand[][] = [];
  const groupIndexByKey = new Map<string, number>();
  for (const entry of legal) {
    const key = commandChoiceGroupKey(entry.command);
    if (!key) {
      groups.push([entry]);
      continue;
    }
    const existingIndex = groupIndexByKey.get(key);
    if (existingIndex === undefined) {
      groupIndexByKey.set(key, groups.length);
      groups.push([entry]);
    } else {
      groups[existingIndex]!.push(entry);
    }
  }
  return groups;
}

function structuredDecisionActionId(decisionId: string): string {
  return `grand-archive:decision:${decisionId}`;
}

function entityKindForId(runtime: GrandArchiveMatchRuntime, id: string) {
  if (runtime.state.objects[id as GrandArchiveObjectId]) return "card" as const;
  if (id in runtime.state.players) return "player" as const;
  return "effect" as const;
}

function entityRefForId(runtime: GrandArchiveMatchRuntime, id: string) {
  const kind = entityKindForId(runtime, id);
  if (kind === "player") {
    return { kind, instanceId: id, ownerId: id } as const;
  }
  const object = runtime.state.objects[id as GrandArchiveObjectId];
  if (!object) return { kind, instanceId: id } as const;
  return {
    kind,
    instanceId: id,
    definitionId: object.activeDefinitionId ?? object.definitionId,
    ownerId: object.ownerId,
    zoneId: object.zone,
  } as const;
}

function publicEntityRefForId(runtime: GrandArchiveMatchRuntime, id: string | undefined) {
  if (!id) return undefined;
  if (id in runtime.state.players) return entityRefForId(runtime, id);
  const object = runtime.state.objects[id as GrandArchiveObjectId];
  if (!object) return undefined;
  const privateZone =
    object.zone === "hand" || object.zone === "main-deck" || object.zone === "material-deck";
  if (privateZone || object.facing === "face-down") return undefined;
  return entityRefForId(runtime, id);
}

function structuredCandidateLabel(runtime: GrandArchiveMatchRuntime, id: string): string {
  const pendingTrigger = runtime.state.pendingTriggers.find((trigger) => trigger.id === id);
  if (pendingTrigger) return pendingTrigger.ability.text || pendingTrigger.ability.id || id;
  const player = runtime.state.players[grandArchivePlayerId(id)];
  if (player) return player.name;
  const object = runtime.state.objects[id as GrandArchiveObjectId];
  if (!object) return id;
  if (object.facing === "face-down" && object.zone === "banishment") return "Face-down card";
  return objectChoiceLabel(runtime, id);
}

function decisionInputId(decision: GrandArchiveDecision): string {
  switch (decision.kind) {
    case "choose-replacement":
      return decision.mode === "order" ? "replacement" : "apply-replacement";
    case "choose-unique-object":
      return "unique-object";
    case "choose-preserve-destination":
      return "preserve";
    case "choose-retaliators":
      return "retaliators";
    case "order-retaliation-damage":
      return "retaliation-order";
    case "resolve-critical":
      return "critical-payment";
    case "declare-resolved-attack":
    case "announce-effect-attack":
      return "attack";
    case "choose-delegated-defender":
      return "defender";
    case "discard-to-influence-limit":
      return "discard";
    case "choose-recollection":
      return "recollection";
    case "announce-triggered-ability":
      return "trigger-announcement";
    case "order-triggered-abilities":
      return "trigger-order";
    case "resolve-optional-effect":
      return "resolve-effect";
    case "resolve-effect-choice":
      return decision.selection.id;
    case "retarget-stack-item":
      return "targets";
    case "remode-stack-item":
      return "modes";
    case "resolve-effect-payment":
      return "effect-payment";
    case "resolve-level-up":
      return "level-up-card";
    case "resolve-direction-choice":
      return "direction";
    case "resolve-distribution":
      return "distribution";
    case "resolve-move-partition":
      return "move-partition";
    case "resolve-counter-allocation":
      return "counter-allocation";
    case "announce-effect-materialization":
      return "materialization";
    case "announce-effect-activation":
      return "activation";
    case "resolve-glimpse":
      return "glimpse";
  }
}

function decisionSourceId(
  runtime: GrandArchiveMatchRuntime,
  decision: GrandArchiveDecision,
): string | undefined {
  if ("stackItemId" in decision) {
    const stackItem = runtime.state.stack.find(
      (candidate) => candidate.id === decision.stackItemId,
    );
    if (stackItem) return "cardId" in stackItem ? stackItem.cardId : stackItem.sourceId;
  }
  switch (decision.kind) {
    case "resolve-critical":
      return decision.sourceId;
    case "declare-resolved-attack":
      return decision.intentId;
    case "choose-delegated-defender":
      return decision.attackerId;
    case "choose-preserve-destination":
      return decision.cardId;
    case "announce-triggered-ability":
      return runtime.state.pendingTriggers.find(
        (trigger) => trigger.id === decision.pendingTriggerId,
      )?.sourceId;
    case "choose-replacement":
    case "choose-unique-object":
    case "choose-retaliators":
    case "order-retaliation-damage":
    case "discard-to-influence-limit":
    case "choose-recollection":
    case "order-triggered-abilities":
    case "resolve-optional-effect":
    case "resolve-effect-choice":
    case "retarget-stack-item":
    case "remode-stack-item":
    case "resolve-effect-payment":
    case "resolve-level-up":
    case "resolve-direction-choice":
    case "resolve-distribution":
    case "resolve-move-partition":
    case "resolve-counter-allocation":
    case "announce-effect-attack":
    case "announce-effect-materialization":
    case "announce-effect-activation":
    case "resolve-glimpse":
      return undefined;
  }
}

function semanticDecisionAnswerValues(
  decision: GrandArchiveDecision,
  answer: unknown,
): Readonly<Record<string, InteractionSubmissionValue>> {
  if (typeof answer === "boolean") return { [decisionInputId(decision)]: answer };
  if (typeof answer === "string" || typeof answer === "number") {
    return { [decisionInputId(decision)]: typeof answer === "string" ? [answer] : answer };
  }
  if (Array.isArray(answer)) {
    const values: Record<string, InteractionSubmissionValue> = {};
    const strings = answer.filter((entry): entry is string => typeof entry === "string");
    values[decisionInputId(decision)] =
      strings.length === answer.length ? strings : [stableDeclarationValue(answer)];
    return values;
  }
  if (
    decision.kind === "resolve-glimpse" &&
    answer &&
    typeof answer === "object" &&
    "kind" in answer
  ) {
    const glimpse = answer as Record<string, unknown>;
    const values: Record<string, InteractionSubmissionValue> = {
      "glimpse-action": [String(glimpse.kind)],
    };
    if (glimpse.kind === "reorder") {
      values["glimpse-order"] = {
        top: Array.isArray(glimpse.top)
          ? glimpse.top.filter((id): id is string => typeof id === "string")
          : [],
        bottom: Array.isArray(glimpse.bottom)
          ? glimpse.bottom.filter((id): id is string => typeof id === "string")
          : [],
      };
    } else if (glimpse.kind === "starcall") {
      values["glimpse-order"] = {
        top: [],
        bottom: Array.isArray(glimpse.bottom)
          ? glimpse.bottom.filter((id): id is string => typeof id === "string")
          : [],
      };
    }
    const remainder = Object.fromEntries(
      Object.entries(glimpse).filter(([key]) => !["kind", "top", "bottom"].includes(key)),
    );
    answer = remainder;
    Object.assign(values, semanticDecisionAnswerValues(decision, remainder));
    return values;
  }
  const values: Record<string, InteractionSubmissionValue> = {};
  const visit = (value: unknown, path: string): void => {
    if (typeof value === "boolean" || typeof value === "number") {
      values[path] = value;
      return;
    }
    if (typeof value === "string") {
      values[path] = [value];
      return;
    }
    if (Array.isArray(value)) {
      if (value.every((entry) => typeof entry === "string")) {
        const strings = value as string[];
        const hasDuplicates = new Set(strings).size !== strings.length;
        values[path] = hasDuplicates
          ? Object.fromEntries(
              [...new Set(strings)].map((id) => [
                id,
                strings.filter((candidate) => candidate === id).length,
              ]),
            )
          : strings;
      } else if (
        path.endsWith("reservePayment") &&
        value.every((entry) => entry && typeof entry === "object")
      ) {
        values[path] = value.flatMap((entry) => {
          const payment = entry as { kind?: unknown; cardId?: unknown; objectId?: unknown };
          const id = payment.kind === "card" ? payment.cardId : payment.objectId;
          return typeof id === "string" ? [id] : [];
        });
      } else if (path.endsWith("costSelections") && value.every(Array.isArray)) {
        value.forEach((selection, index) => visit(selection, `${path}:${index}`));
      } else if (
        path.endsWith("allocations") &&
        value.every(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            typeof (entry as { objectId?: unknown }).objectId === "string" &&
            typeof (entry as { amount?: unknown }).amount === "number",
        )
      ) {
        values[path] = Object.fromEntries(
          value.map((entry) => {
            const allocation = entry as { objectId: string; amount: number };
            return [allocation.objectId, allocation.amount];
          }),
        );
      } else if (path.endsWith("partitions") && value.every(Array.isArray)) {
        values[path] = Object.fromEntries(
          value.map((route, index) => [String(index), route as string[]]),
        );
      } else {
        values[path] = [stableDeclarationValue(value)];
      }
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        const childPath = key === "targets" ? path : path.length === 0 ? key : `${path}.${key}`;
        if (key === "targets" && child && typeof child === "object" && !Array.isArray(child)) {
          for (const [binding, targets] of Object.entries(child))
            visit(targets, `target:${binding}`);
        } else if (
          key === "variables" &&
          child &&
          typeof child === "object" &&
          !Array.isArray(child)
        ) {
          for (const [symbol, amount] of Object.entries(child)) visit(amount, `variable:${symbol}`);
        } else {
          visit(child, childPath);
        }
      }
    }
  };
  if (answer && typeof answer === "object") visit(answer, "");
  return values;
}

function semanticDecisionInputs(
  runtime: GrandArchiveMatchRuntime,
  decision: GrandArchiveDecision,
  candidates: readonly GrandArchiveDecisionAnswerCandidate[] = listGrandArchiveDecisionAnswerCandidates(
    runtime.program,
    runtime.state,
    decision,
  ),
): InteractionInput[] {
  const hasOptionalComplexAnswer =
    candidates.some((candidate) => candidate.answer === false) &&
    candidates.some(
      (candidate) => candidate.answer !== false && typeof candidate.answer !== "boolean",
    );
  const answerValues: Readonly<Record<string, InteractionSubmissionValue>>[] = candidates.map(
    (candidate) => ({
      ...(hasOptionalComplexAnswer ? { accept: candidate.answer !== false } : {}),
      ...(candidate.answer === false && hasOptionalComplexAnswer
        ? {}
        : semanticDecisionAnswerValues(decision, candidate.answer)),
    }),
  );
  const inputIds = [...new Set(answerValues.flatMap((values) => Object.keys(values)))];
  const priority = (id: string) =>
    id === "accept"
      ? 0
      : id.includes("costOption") || id.includes("optional")
        ? 1
        : id.startsWith("variable:")
          ? 2
          : id.includes("mode")
            ? 3
            : id.startsWith("target:") || id.includes("target") || id.includes("attacker")
              ? 4
              : id.includes("payment") || id.includes("cost")
                ? 5
                : id.includes("order")
                  ? 6
                  : 7;
  inputIds.sort((left, right) => priority(left) - priority(right) || left.localeCompare(right));
  return inputIds.flatMap((id): InteractionInput[] => {
    const present = answerValues.flatMap((values) =>
      values[id] === undefined ? [] : [values[id]!],
    );
    if (present.length === 0) return [];
    const required = present.length === answerValues.length;
    const earlierDiscriminators = inputIds.slice(0, inputIds.indexOf(id)).filter((candidateId) => {
      const candidateValues = answerValues.map((values) => values[candidateId]);
      return (
        candidateValues.every(
          (value) =>
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            (Array.isArray(value) && value.every((entry) => typeof entry === "string")),
        ) && new Set(candidateValues.map(stableDeclarationValue)).size > 1
      );
    });
    const conditionalRequirements = !required
      ? [
          ...new Map(
            answerValues.flatMap((values) => {
              if (values[id] === undefined) return [];
              const all = earlierDiscriminators.map((inputId) => {
                const value = values[inputId]!;
                return {
                  inputId,
                  value: Array.isArray(value) ? [...value] : (value as string | number | boolean),
                };
              });
              if (all.length === 0 && values.accept === true)
                all.push({ inputId: "accept", value: true });
              return all.length > 0 ? [[stableDeclarationValue(all), { all }] as const] : [];
            }),
          ).values(),
        ]
      : [];
    const requiredWhen = conditionalRequirements.length > 0 ? conditionalRequirements : undefined;
    const text = { key: id.replaceAll(".", " ").replaceAll(":", " ").replaceAll("-", " ") };
    const common = { id, text, required, ...(requiredWhen ? { requiredWhen } : {}) };
    if (present.every((value) => typeof value === "boolean")) {
      return [
        {
          ...common,
          kind: "boolean",
          trueText: { key: id === "accept" ? "Continue" : "Yes" },
          falseText: { key: id === "accept" ? "Skip" : "No" },
        },
      ];
    }
    if (present.every((value) => typeof value === "number")) {
      const numbers = present as number[];
      return [
        {
          ...common,
          kind: "number",
          min: Math.min(...numbers),
          max: Math.max(...numbers),
          step: 1,
        },
      ];
    }
    if (present.every((value) => value && typeof value === "object" && !Array.isArray(value))) {
      const records = present as Readonly<Record<string, number | string[]>>[];
      const keys = [...new Set(records.flatMap((record) => Object.keys(record)))];
      if (
        records.every((record) => Object.values(record).every((value) => typeof value === "number"))
      ) {
        const numericRecords = records as Readonly<Record<string, number>>[];
        const totals = numericRecords.map((record) =>
          Object.values(record).reduce((total, value) => total + value, 0),
        );
        return [
          {
            ...common,
            kind: "entity-allocation",
            role: id.includes("payment") || id.includes("cost") ? "cost" : "target",
            entityKinds: [...new Set(keys.map((key) => entityKindForId(runtime, key)))],
            totalMin: Math.min(...totals),
            totalMax: Math.max(...totals),
            candidates: keys.map((key) => ({
              entity: entityRefForId(runtime, key),
              text: { key: structuredCandidateLabel(runtime, key) },
              enabled: true,
              min: 0,
              max: Math.max(...numericRecords.map((record) => record[key] ?? 0)),
            })),
          },
        ];
      }
      return [
        {
          ...common,
          kind: "entity-partition",
          entityKind: "card",
          candidates: [...new Set(records.flatMap((record) => Object.values(record).flat()))].map(
            (key) => ({
              entity: entityRefForId(runtime, key as string),
              text: { key: structuredCandidateLabel(runtime, key as string) },
              enabled: true,
            }),
          ),
          routes: keys.map((key) => ({
            id: key,
            text: {
              key:
                decision.kind === "resolve-glimpse"
                  ? key === "top"
                    ? "Top"
                    : "Bottom"
                  : `Group ${Number(key) + 1}`,
            },
            kind: "destination" as const,
            ordered: true,
            orderDirection: "top-first" as const,
            min: Math.min(
              ...records.map((record) => (record[key] as string[] | undefined)?.length ?? 0),
            ),
            max: Math.max(
              ...records.map((record) => (record[key] as string[] | undefined)?.length ?? 0),
            ),
          })),
          assignment: "exhaustive",
        },
      ];
    }
    const arrays = present.map((value) =>
      Array.isArray(value)
        ? value
        : [
            typeof value === "string"
              ? value
              : typeof value === "number" || typeof value === "boolean"
                ? value.toString()
                : (JSON.stringify(value) ?? "null"),
          ],
    ) as string[][];
    const optionIds = [...new Set(arrays.flat())];
    const allEntities = optionIds.every(
      (candidateId) => entityKindForId(runtime, candidateId) !== "effect",
    );
    if (allEntities) {
      const ordered =
        decision.kind === "order-retaliation-damage" ||
        decision.kind === "order-triggered-abilities" ||
        decision.kind === "resolve-glimpse";
      return [
        {
          ...common,
          kind: ordered ? "ordering" : "entity-selection",
          ...(ordered
            ? {
                entityKind: entityKindForId(runtime, optionIds[0]!),
                min: Math.min(...arrays.map((value) => value.length)),
                max: Math.max(...arrays.map((value) => value.length)),
              }
            : {
                role:
                  id.includes("payment") || id.includes("cost")
                    ? ("cost" as const)
                    : id.includes("attacker") || id.includes("weapon")
                      ? ("attacker" as const)
                      : ("target" as const),
                entityKinds: [
                  ...new Set(optionIds.map((candidateId) => entityKindForId(runtime, candidateId))),
                ],
                min: Math.min(...arrays.map((value) => value.length)),
                max: Math.max(...arrays.map((value) => value.length)),
                ordered: false,
              }),
          candidates: optionIds.map((candidateId) => ({
            entity: entityRefForId(runtime, candidateId),
            text: { key: structuredCandidateLabel(runtime, candidateId) },
            enabled: true,
          })),
        } as InteractionInput,
      ];
    }
    return [
      {
        ...common,
        kind: "option-selection",
        min: Math.min(...arrays.map((value) => value.length)),
        max: Math.max(...arrays.map((value) => value.length)),
        options: optionIds.map((optionId) => ({
          id: optionId,
          text: { key: optionId },
          enabled: true,
        })),
        ...(decision.kind === "resolve-effect-choice" &&
        decision.selection.candidates.kind === "catalog-card"
          ? {
              presentation: {
                kind: "search" as const,
                label: { key: "Search cards" },
                placeholder: { key: "Card name" },
                confirmLabel: { key: "Choose card" },
              },
            }
          : {}),
      },
    ];
  });
}

function structuredDecisionInput(
  runtime: GrandArchiveMatchRuntime,
  decision: NonNullable<GrandArchiveMatchRuntime["state"]["decision"]>,
): InteractionInput | null {
  const description = describeGrandArchiveStructuredDecision(
    runtime.program,
    runtime.state,
    decision,
  );
  if (description.kind === "semantic") return null;
  const presentation = decisionPresentation(decision);
  const common = {
    id: decisionInputId(decision),
    text: { key: presentation.instruction },
    required: true,
  } as const;
  if (description.kind === "boolean") {
    const labels =
      decision.kind === "choose-preserve-destination"
        ? { yes: "Preserve", no: "Banish instead" }
        : decision.kind === "choose-replacement"
          ? { yes: "Apply replacement", no: "Decline replacement" }
          : { yes: "Resolve effect", no: "Decline effect" };
    return {
      ...common,
      kind: "boolean",
      trueText: { key: labels.yes },
      falseText: { key: labels.no },
    };
  }
  if (description.kind === "option-selection") {
    if (description.optionIds.length === 0) return null;
    return {
      ...common,
      kind: "option-selection",
      min: description.minimum,
      max: description.maximum,
      options: description.optionIds.map((id, index) => ({
        id,
        text: {
          key:
            decision.kind === "choose-replacement"
              ? `Replacement ${index + 1}`
              : id.charAt(0).toUpperCase() + id.slice(1),
        },
        enabled: true,
      })),
    };
  }
  if (description.kind === "partition") {
    if (description.candidateIds.length === 0) return null;
    const candidates = description.candidateIds.map((id) => ({
      entity: entityRefForId(runtime, id),
      text: { key: structuredCandidateLabel(runtime, id) },
      enabled: true,
    }));
    return {
      ...common,
      kind: "entity-partition",
      entityKind: candidates[0]?.entity.kind ?? "card",
      candidateSetText: { key: "Cards to separate" },
      candidates,
      routes: description.routeIds.map((id, index) => ({
        id,
        text: { key: `Group ${index + 1}` },
        kind: "destination" as const,
        ordered: true,
        orderDirection: "top-first" as const,
        min: 0,
        max: candidates.length,
      })),
      assignment: "exhaustive",
    };
  }
  if (description.kind === "allocation") {
    if (description.candidates.length === 0) return null;
    return {
      ...common,
      id: decision.kind === "resolve-distribution" ? "distribution" : "counter-allocation",
      kind: "entity-allocation",
      role: "target",
      entityKinds: [
        ...new Set(
          description.candidates.map((candidate) => entityKindForId(runtime, candidate.id)),
        ),
      ],
      totalMin: description.totalMinimum,
      totalMax: description.totalMaximum,
      candidates: description.candidates.map((candidate) => ({
        entity: entityRefForId(runtime, candidate.id),
        text: { key: structuredCandidateLabel(runtime, candidate.id) },
        enabled: candidate.maximum > 0,
        min: candidate.minimum,
        max: candidate.maximum,
      })),
    };
  }
  if (
    description.candidateIds.length === 0 ||
    (description.kind === "identity-selection" &&
      (description.minimum > description.candidateIds.length ||
        description.maximum > description.candidateIds.length))
  ) {
    return null;
  }
  const candidates = description.candidateIds.map((id) => ({
    entity: entityRefForId(runtime, id),
    text: { key: structuredCandidateLabel(runtime, id) },
    enabled: true,
  }));
  if (description.kind === "ordering") {
    return {
      ...common,
      kind: "ordering",
      entityKind: candidates[0]?.entity.kind ?? "effect",
      min: candidates.length,
      max: candidates.length,
      candidates,
    };
  }
  return {
    ...common,
    kind: "entity-selection",
    role: "target",
    entityKinds: [...new Set(candidates.map((candidate) => candidate.entity.kind))],
    min: description.minimum,
    max: description.maximum,
    ordered: description.ordered,
    candidates,
  };
}

function structuredDecisionInputs(
  runtime: GrandArchiveMatchRuntime,
  decision: GrandArchiveDecision,
): InteractionInput[] {
  const input = structuredDecisionInput(runtime, decision);
  return input ? [input] : semanticDecisionInputs(runtime, decision);
}

function structuredDecisionAction(
  runtime: GrandArchiveMatchRuntime,
  decision: NonNullable<GrandArchiveMatchRuntime["state"]["decision"]>,
): InteractionAction | null {
  const inputs = structuredDecisionInputs(runtime, decision);
  if (inputs.length === 0) return null;
  const incarnationMap = Object.fromEntries(
    inputs
      .flatMap((input) => ("candidates" in input ? input.candidates : []))
      .flatMap((candidate) =>
        candidate.entity.kind === "card"
          ? [
              [
                candidate.entity.instanceId,
                runtime.state.objects[candidate.entity.instanceId as GrandArchiveObjectId]
                  ?.incarnation ?? -1,
              ] as const,
            ]
          : [],
      )
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)),
  );
  const incarnations = Object.entries(incarnationMap)
    .map(([id, incarnation]) => `${id}@${incarnation}`)
    .join(",");
  const presentation = decisionPresentation(decision);
  const interactionSource = publicEntityRefForId(runtime, decisionSourceId(runtime, decision));
  return {
    id: structuredDecisionActionId(decision.id),
    requestId: `grand-archive:${runtime.state.stateVersion}:${incarnations || "none"}`,
    intent: presentation.intent,
    text: { key: presentation.title },
    enabled: true,
    ...(interactionSource ? { source: interactionSource } : {}),
    inputs,
  };
}

function decisionRequirement(input: InteractionInput | undefined) {
  if (!input) return undefined;
  const bounds =
    input.kind === "entity-selection" ||
    input.kind === "option-selection" ||
    input.kind === "ordering" ||
    input.kind === "number"
      ? { min: input.min, max: input.max }
      : input.kind === "entity-partition"
        ? { min: input.candidates.length, max: input.candidates.length }
        : input.kind === "entity-allocation"
          ? { min: input.totalMin, max: input.totalMax }
          : {};
  return {
    kind: input.kind,
    text: input.text,
    required: input.required !== false,
    ...bounds,
  };
}

function commandForStructuredDeclaration(
  entries: readonly GrandArchiveLegalCommand[],
  submission: InteractionSubmission,
  inputs: readonly InteractionInput[],
): GrandArchiveLegalCommand | null {
  const declarations = entries.filter(
    (entry): entry is GrandArchiveLegalCommand & { command: GrandArchiveDeclarationCommand } =>
      isDeclarationCommand(entry.command),
  );
  if (declarations.length !== entries.length) return null;
  const exactChoice = submission.values["legal-declaration"];
  if (Array.isArray(exactChoice) && exactChoice.length === 1) {
    return (
      declarations.find((entry) => stableDeclarationValue(entry.command) === exactChoice[0]) ?? null
    );
  }
  return (
    declarations.find((entry) => {
      const command = entry.command;
      return Object.entries(submission.values).every(([inputId, submitted]) => {
        const input = inputs.find((candidate) => candidate.id === inputId);
        if (!input) return false;
        const valueMatches = (actual: unknown, expected: unknown) =>
          interactionValueMatches(input, actual, expected);
        if (inputId === "pay-optional-cost")
          return valueMatches(submitted, command.payOptionalCost ?? false);
        if (inputId === "cost-option")
          return valueMatches(submitted, [String(command.costOptionIndex)]);
        if (inputId === "activation-method")
          return valueMatches(
            submitted,
            "activationMethod" in command && command.activationMethod
              ? [command.activationMethod]
              : [],
          );
        if (inputId === "modes") return valueMatches(submitted, command.modeIds ?? []);
        if (inputId.startsWith("variable:")) {
          const symbol = inputId.slice("variable:".length) as "X" | "Y" | "Z";
          return valueMatches(submitted, command.variables?.[symbol]);
        }
        if (inputId.startsWith("target:")) {
          return valueMatches(submitted, command.targets?.[inputId.slice("target:".length)] ?? []);
        }
        if (inputId === "reserve-payment") {
          return valueMatches(
            submitted,
            (command.reservePayment ?? []).map((payment) =>
              payment.kind === "card" ? payment.cardId : payment.objectId,
            ),
          );
        }
        if (inputId.startsWith("additional-cost:")) {
          const index = Number(inputId.slice("additional-cost:".length));
          return valueMatches(submitted, command.costSelections?.[index] ?? []);
        }
        if (inputId === "cost-order") {
          return valueMatches(submitted, [stableDeclarationValue(command.costPaymentOrders ?? [])]);
        }
        if (inputId.startsWith("additional:")) {
          const field = inputId.slice("additional:".length) as
            | "brewIngredientIds"
            | "kindleCardIds"
            | "floatingMemoryCardIds";
          return valueMatches(submitted, declarationEntityField(command, field));
        }
        return false;
      });
    }) ?? null
  );
}

function commandForStructuredAttack(
  entries: readonly GrandArchiveLegalCommand[],
  submission: InteractionSubmission,
  inputs: readonly InteractionInput[],
): GrandArchiveLegalCommand | null {
  const attacks = entries.filter(
    (entry): entry is GrandArchiveLegalCommand & { command: GrandArchiveAttackCommand } =>
      entry.command.move === "declare-attack",
  );
  if (attacks.length !== entries.length) return null;
  return (
    attacks.find(({ command }) =>
      Object.entries(submission.values).every(([inputId, value]) => {
        const input = inputs.find((candidate) => candidate.id === inputId);
        if (!input) return false;
        const matches = (actual: unknown, expected: unknown) =>
          interactionValueMatches(input, actual, expected);
        switch (inputId) {
          case "attacker":
            return matches(value, [command.attackerId]);
          case "weapons":
            return matches(value, command.weaponIds ?? []);
          case "attack-targets":
            return matches(value, command.targetIds);
          case "delegated-player":
            return matches(value, command.delegatePlayerId ? [command.delegatePlayerId] : []);
          case "cleave-player":
            return matches(value, command.cleavePlayerId ? [command.cleavePlayerId] : []);
          case "attack-payment":
            return matches(
              value,
              (command.reservePayment ?? []).map((payment) =>
                payment.kind === "card" ? payment.cardId : payment.objectId,
              ),
            );
          case "attack-cost-option":
            return matches(value, [String(command.costOptionIndex)]);
          default:
            return false;
        }
      }),
    ) ?? null
  );
}

const interactionCache = new WeakMap<
  GrandArchiveMatchRuntime,
  {
    readonly state: GrandArchiveMatchRuntime["state"];
    readonly players: Map<string, GrandArchiveInteractionProjection>;
  }
>();

/** Share authoritative legality across controls and resources for the same immutable state. */
export function projectGrandArchiveInteraction(
  runtime: GrandArchiveMatchRuntime,
  actorId: string,
): GrandArchiveInteractionProjection {
  let cached = interactionCache.get(runtime);
  if (cached?.state !== runtime.state) {
    cached = { state: runtime.state, players: new Map() };
    interactionCache.set(runtime, cached);
  }
  const existing = cached.players.get(actorId);
  if (existing) return existing;
  const projection = buildGrandArchiveInteraction(runtime, actorId);
  cached.players.set(actorId, projection);
  return projection;
}

/** Projects controls solely from authoritative engine legality and decision descriptions. */
function buildGrandArchiveInteraction(
  runtime: GrandArchiveMatchRuntime,
  actorId: string,
): GrandArchiveInteractionProjection {
  const playerId = grandArchivePlayerId(actorId);
  const stateVersion = runtime.state.stateVersion;
  const decision = runtime.state.decision;
  const hasStructuredDecision = Boolean(decision);
  const legal = listGrandArchiveLegalCommands(runtime.program, runtime.state, playerId, {
    includeConcede: true,
    ...(hasStructuredDecision ? { maximumDecisionCandidates: 1 } : {}),
  });
  const decisionAction =
    decision?.playerId === playerId ? structuredDecisionAction(runtime, decision) : null;
  const commandsByActionId = new Map<string, readonly GrandArchiveLegalCommand[]>();
  const commandGroups = groupLegalCommands(
    legal.filter((entry) => !decisionAction || entry.command.move !== "answer-decision"),
  );
  const actions = commandGroups.map((entries, index): InteractionAction => {
    const incarnationMap = Object.fromEntries(
      entries.flatMap((entry) =>
        Object.entries(grandArchiveCommandIncarnations(runtime, entry.command)),
      ),
    );
    const incarnations = Object.entries(incarnationMap)
      .map(([id, incarnation]) => `${id}@${incarnation}`)
      .join(",");
    const requestId = `grand-archive:${stateVersion}:${incarnations || "none"}`;
    const id = `${requestId}:${index}`;
    commandsByActionId.set(id, entries);
    const first = entries[0]!;
    const source = sourceId(first.command);
    const declarationInputs =
      entries.length > 1
        ? (structuredDeclarationInputs(runtime, entries) ??
          structuredAttackInputs(runtime, entries))
        : null;
    return {
      id,
      requestId,
      intent: intentForCommand(first.command),
      text: { key: entries.length === 1 ? commandChoiceLabel(runtime, first) : first.label },
      enabled: true,
      ...(source ? { source: entityRefForId(runtime, source) } : {}),
      inputs: entries.length === 1 ? [] : (declarationInputs ?? []),
    };
  });
  if (decisionAction) {
    commandsByActionId.set(
      decisionAction.id,
      legal.filter((entry) => entry.command.move === "answer-decision"),
    );
    actions.push(decisionAction);
  }
  const wait = readGrandArchiveWaitState(runtime.state);
  const actorMustChoose = "playerId" in wait && wait.playerId === playerId;
  const status =
    wait.kind === "game-over"
      ? "game-over"
      : wait.kind === "decision" && actorMustChoose
        ? "choosing"
        : actions.length > 0
          ? "ready"
          : "waiting";
  const activeDecision = runtime.state.decision;
  const activeDecisionPresentation = activeDecision
    ? decisionPresentation(activeDecision)
    : undefined;
  const resolvingSource = activeDecision
    ? publicEntityRefForId(runtime, decisionSourceId(runtime, activeDecision))
    : undefined;
  const activeRequirement = actorMustChoose
    ? decisionRequirement(decisionAction?.inputs[0])
    : undefined;
  return {
    view: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "grand-archive",
      actorId,
      stateVersion,
      status,
      ...(wait.kind === "decision"
        ? {
            resolution: {
              actingPlayerId: wait.playerId,
              pendingCount: 1,
              currentEffect: {
                id: runtime.state.decision?.id ?? `decision:${stateVersion}`,
                text: {
                  key: activeDecisionPresentation?.title ?? "Resolve effect",
                },
                ...(resolvingSource ? { source: resolvingSource } : {}),
              },
              currentStep: {
                index: 1,
                count: 1,
                text: {
                  key: actorMustChoose
                    ? (activeDecisionPresentation?.instruction ?? "Choose an answer.")
                    : "Opponent is choosing…",
                },
                ...(activeRequirement ? { requirement: activeRequirement } : {}),
              },
            },
          }
        : {}),
      actions,
    },
    commandsByActionId,
  };
}

export function commandForGrandArchiveSubmission(
  runtime: GrandArchiveMatchRuntime,
  actorId: string,
  submission: InteractionSubmission,
): GrandArchiveLegalCommand | null {
  const playerId = grandArchivePlayerId(actorId);
  const decision = runtime.state.decision;
  if (
    decision?.playerId === playerId &&
    submission.actionId === structuredDecisionActionId(decision.id)
  ) {
    const description = describeGrandArchiveStructuredDecision(
      runtime.program,
      runtime.state,
      decision,
    );
    const structuredInput = structuredDecisionInput(runtime, decision);
    if (!structuredInput) {
      const candidates = listGrandArchiveDecisionAnswerCandidates(
        runtime.program,
        runtime.state,
        decision,
      );
      const hasOptionalComplexAnswer =
        candidates.some((candidate) => candidate.answer === false) &&
        candidates.some(
          (candidate) => candidate.answer !== false && typeof candidate.answer !== "boolean",
        );
      const inputsById = new Map(
        semanticDecisionInputs(runtime, decision, candidates).map((input) => [input.id, input]),
      );
      const selected = candidates.find((candidate) => {
        const values: Readonly<Record<string, InteractionSubmissionValue>> = {
          ...(hasOptionalComplexAnswer ? { accept: candidate.answer !== false } : {}),
          ...(candidate.answer === false && hasOptionalComplexAnswer
            ? {}
            : semanticDecisionAnswerValues(decision, candidate.answer)),
        };
        return [...new Set([...Object.keys(values), ...Object.keys(submission.values)])].every(
          (id) => {
            const input = inputsById.get(id);
            return (
              input !== undefined &&
              interactionValueMatches(input, submission.values[id], values[id])
            );
          },
        );
      });
      if (!selected) return null;
      return {
        playerId,
        stateVersion: runtime.state.stateVersion,
        command: {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: selected.answer,
        },
        label: decisionPresentation(decision).title,
      };
    }
    const input = structuredInput;
    const submittedAnswer = submission.values[input.id];
    const answer =
      description.kind === "partition" &&
      submittedAnswer &&
      typeof submittedAnswer === "object" &&
      !Array.isArray(submittedAnswer)
        ? {
            partitions: description.routeIds.map((routeId) => submittedAnswer[routeId] ?? []),
          }
        : description.kind === "allocation" &&
            submittedAnswer &&
            typeof submittedAnswer === "object" &&
            !Array.isArray(submittedAnswer)
          ? {
              allocations: Object.entries(submittedAnswer)
                .filter(
                  (entry): entry is [string, number] =>
                    typeof entry[1] === "number" && entry[1] > 0,
                )
                .map(([objectId, amount]) => ({ objectId, amount })),
            }
          : description.kind === "option-selection" &&
              Array.isArray(submittedAnswer) &&
              submittedAnswer.length === 1
            ? submittedAnswer[0]
            : submittedAnswer;
    return {
      playerId,
      stateVersion: runtime.state.stateVersion,
      command: {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer,
      },
      label: decisionPresentation(decision).title,
    };
  }
  const projection = projectGrandArchiveInteraction(runtime, actorId);
  const entries = projection.commandsByActionId.get(submission.actionId);
  const action = projection.view.actions.find((candidate) => candidate.id === submission.actionId);
  if (!entries || !action) return null;
  if (entries.length === 1) return entries[0]!;
  const structuredDeclaration = commandForStructuredDeclaration(entries, submission, action.inputs);
  if (structuredDeclaration) return structuredDeclaration;
  const structuredAttack = commandForStructuredAttack(entries, submission, action.inputs);
  if (structuredAttack) return structuredAttack;
  return null;
}
