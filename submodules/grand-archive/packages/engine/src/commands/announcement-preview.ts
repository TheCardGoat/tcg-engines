import type {
  GrandArchiveVariableDeclaration,
  GrandArchiveTargetDeclaration,
  GrandArchiveModeEffect,
} from "@tcg/grand-archive-types";
import type { GrandArchiveTargetId } from "../game/identity.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import {
  declareGrandArchiveModes,
  declareGrandArchiveTargetsWithRandom,
  grandArchiveSelectionCountBounds,
  grandArchiveSelectionRequiresAll,
  isGrandArchiveTargetCandidate,
  type GrandArchiveAnnouncementModes,
} from "../procedures/activation/activation.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
} from "../procedures/effects/evaluation.ts";

export interface GrandArchiveAnnouncementDraft {
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}
type StepStatus = "complete" | "missing" | "invalid";
type StepBase = { readonly id: string; readonly status: StepStatus; readonly error?: string };
export type GrandArchiveAnnouncementPreviewStep = StepBase &
  (
    | {
        readonly kind: "number";
        readonly symbol: "X" | "Y" | "Z";
        readonly minimum: number;
        readonly maximum?: number;
        readonly value?: number;
      }
    | {
        readonly kind: "modes";
        readonly options: readonly { readonly id: string; readonly text: string }[];
        readonly minimum: number;
        readonly maximum?: number;
        readonly allowRepeated: boolean;
        readonly value?: readonly string[];
      }
    | {
        readonly kind: "targets";
        readonly binding: string;
        readonly candidateIds: readonly GrandArchiveTargetId[];
        readonly minimum: number;
        readonly maximum?: number;
        readonly ordered: boolean;
        readonly allowRepeated: boolean;
        readonly value?: readonly GrandArchiveTargetId[];
      }
  );
interface PreviewBase {
  readonly steps: readonly GrandArchiveAnnouncementPreviewStep[];
  readonly ignoredInputIds: readonly string[];
}
export type GrandArchiveAnnouncementPreview = PreviewBase &
  (
    | { readonly status: "incomplete" | "invalid"; readonly message?: string }
    | { readonly status: "unavailable"; readonly message: string }
    | { readonly status: "ready"; readonly declaration: GrandArchiveAnnouncementDraft }
  );

/** Evaluates the next declaration from its real dependencies, never a Cartesian sample. */
export function previewGrandArchiveAnnouncement(request: {
  readonly state: GrandArchiveMatchState;
  readonly draft: GrandArchiveAnnouncementDraft;
  readonly variables: readonly GrandArchiveVariableDeclaration[];
  readonly evaluate: (
    variables: GrandArchiveAnnouncementDraft["variables"],
  ) => GrandArchiveEvaluationContext;
  readonly context: (variables: GrandArchiveAnnouncementDraft["variables"]) => {
    readonly evaluation: GrandArchiveEvaluationContext;
    readonly modeDeclaration?: GrandArchiveAnnouncementModes;
    readonly automaticModes: readonly GrandArchiveModeEffect[];
  };
  readonly targets: (
    modes: readonly GrandArchiveModeEffect[],
    evaluation: GrandArchiveEvaluationContext,
  ) => {
    readonly declarations: readonly GrandArchiveTargetDeclaration[];
    readonly evaluation: GrandArchiveEvaluationContext;
  };
  readonly validate: (declaration: GrandArchiveAnnouncementDraft) => void;
}): GrandArchiveAnnouncementPreview {
  const { state } = request;
  const steps: GrandArchiveAnnouncementPreviewStep[] = [];
  const ignoredInputIds: string[] = [];
  const base = { steps, ignoredInputIds };
  const unavailable = (message: string): GrandArchiveAnnouncementPreview => ({
    ...base,
    status: "unavailable",
    message,
  });
  const draft = request.draft;
  const variables: Partial<Record<"X" | "Y" | "Z", number>> = {};
  const targets: Record<string, readonly GrandArchiveTargetId[]> = {};
  const putStep = (step: GrandArchiveAnnouncementPreviewStep) => {
    const index = steps.findIndex((existing) => existing.id === step.id);
    if (index === -1) steps.push(step);
    else steps[index] = step;
  };
  const readVariables = (
    declarations: readonly GrandArchiveVariableDeclaration[],
  ): GrandArchiveAnnouncementPreview | undefined => {
    const symbols = [
      ...new Set(
        declarations.flatMap((variable) => (variable.kind === "chosen" ? [variable.symbol] : [])),
      ),
    ];
    for (const symbol of symbols) {
      const chosen = declarations.filter(
        (variable) => variable.kind === "chosen" && variable.symbol === symbol,
      );
      const evaluation = request.evaluate(variables);
      const minima: number[] = [],
        maxima: number[] = [];
      for (const declaration of chosen) {
        if (declaration.kind !== "chosen") continue;
        minima.push(evaluateGrandArchiveAmount(declaration.minimum, evaluation));
        if (declaration.maximum !== undefined)
          maxima.push(evaluateGrandArchiveAmount(declaration.maximum, evaluation));
      }
      const minimum = Math.max(...minima),
        maximum = maxima.length ? Math.min(...maxima) : undefined;
      const value = draft.variables?.[symbol];
      const invalid =
        value !== undefined &&
        (!Number.isSafeInteger(value) ||
          value < minimum ||
          (maximum !== undefined && value > maximum));
      putStep({
        id: `variable:${symbol}`,
        kind: "number",
        symbol,
        minimum,
        ...(maximum !== undefined ? { maximum } : {}),
        ...(value !== undefined ? { value } : {}),
        status: value === undefined ? "missing" : invalid ? "invalid" : "complete",
        ...(invalid ? { error: `Choose a legal value for ${symbol}` } : {}),
      });
      if (value === undefined || invalid)
        return { ...base, status: invalid ? "invalid" : "incomplete" };
      variables[symbol] = value;
    }
    return undefined;
  };
  try {
    const baseVariables = request.variables;
    const variableQuestion = readVariables(baseVariables);
    if (variableQuestion) return variableQuestion;
    let context = request.context(variables);
    if (context.modeDeclaration?.random) return unavailable("Random modes cannot be previewed");
    let modeIds: readonly string[] | undefined;
    if (context.modeDeclaration) {
      const options = context.modeDeclaration.modes
        .filter(
          (mode) =>
            !mode.condition || evaluateGrandArchiveCondition(mode.condition, context.evaluation),
        )
        .map((mode) => ({ id: mode.id, text: mode.text }));
      const bounds = grandArchiveSelectionCountBounds(
        { count: context.modeDeclaration.choose },
        context.evaluation,
      );
      modeIds = draft.modeIds;
      let error: string | undefined;
      if (modeIds !== undefined) {
        try {
          declareGrandArchiveModes(context.modeDeclaration, modeIds, context.evaluation);
        } catch (failure) {
          if (!(failure instanceof Error)) throw failure;
          error = failure.message;
        }
      }
      putStep({
        id: "modes",
        kind: "modes",
        options,
        minimum: bounds.minimum,
        ...(Number.isFinite(bounds.maximum) ? { maximum: bounds.maximum } : {}),
        allowRepeated: context.modeDeclaration.allowRepeat === true,
        ...(modeIds !== undefined ? { value: modeIds } : {}),
        status: modeIds === undefined ? "missing" : error ? "invalid" : "complete",
        ...(error ? { error } : {}),
      });
      if (modeIds === undefined || error)
        return { ...base, status: error ? "invalid" : "incomplete" };
    } else if (draft.modeIds !== undefined) ignoredInputIds.push("modes");
    const selected = declareGrandArchiveModes(context.modeDeclaration, modeIds, context.evaluation);
    const modeVariableQuestion = readVariables([
      ...baseVariables,
      ...[...context.automaticModes, ...selected.modes].flatMap((mode) => mode.variables ?? []),
    ]);
    if (modeVariableQuestion) return modeVariableQuestion;
    context = request.context(variables);
    const confirmedModes = declareGrandArchiveModes(
      context.modeDeclaration,
      modeIds,
      context.evaluation,
    );
    const modes = [...context.automaticModes, ...confirmedModes.modes];
    const { declarations, evaluation } = request.targets(modes, context.evaluation);
    if (declarations.some((target) => target.method === "random"))
      return unavailable("Random targets cannot be previewed");
    if (declarations.some((target) => target.chooser !== "controller"))
      return unavailable("This declaration requires another chooser");
    const activeTargets = new Set(declarations.map((target) => target.id));
    ignoredInputIds.push(
      ...Object.keys(draft.targets ?? {})
        .filter((id) => !activeTargets.has(id))
        .map((id) => `target:${id}`),
    );
    ignoredInputIds.push(
      ...Object.keys(draft.variables ?? {})
        .filter((symbol) => !Object.hasOwn(variables, symbol))
        .map((symbol) => `variable:${symbol}`),
    );
    const potential: readonly GrandArchiveTargetId[] = [
      ...Object.values(state.objects).map((object) => object.id),
      ...state.turnOrder,
      ...state.stack.map((item) => item.id),
    ];
    for (const [index, declaration] of declarations.entries()) {
      const contextual = { ...evaluation, bindings: { ...evaluation.bindings, ...targets } };
      const alreadyTargeted = new Set(Object.values(targets).flat());
      const candidateIds = potential.filter(
        (id) =>
          (declaration.allowRepeated || !alreadyTargeted.has(id)) &&
          isGrandArchiveTargetCandidate(id, declaration, contextual),
      );
      const all = grandArchiveSelectionRequiresAll(declaration, contextual);
      const bounds = all
        ? { minimum: candidateIds.length, maximum: candidateIds.length }
        : grandArchiveSelectionCountBounds(declaration, contextual);
      const maximum = declaration.allowRepeated
        ? bounds.maximum
        : Math.min(bounds.maximum, candidateIds.length);
      if (bounds.minimum > maximum)
        return {
          ...base,
          status: "invalid",
          message: `Target ${declaration.id} has too few legal candidates; change an earlier declaration`,
        };
      const value = draft.targets?.[declaration.id];
      let error: string | undefined;
      if (value !== undefined) {
        try {
          declareGrandArchiveTargetsWithRandom(
            declarations.slice(0, index + 1),
            { ...targets, [declaration.id]: value },
            evaluation,
          );
        } catch (failure) {
          if (!(failure instanceof Error)) throw failure;
          error = failure.message;
        }
      }
      putStep({
        id: `target:${declaration.id}`,
        kind: "targets",
        binding: declaration.id,
        candidateIds,
        minimum: bounds.minimum,
        ...(Number.isFinite(maximum) ? { maximum } : {}),
        ordered: declaration.ordered === true,
        allowRepeated: declaration.allowRepeated === true,
        ...(value !== undefined ? { value } : {}),
        status: value === undefined ? "missing" : error ? "invalid" : "complete",
        ...(error ? { error } : {}),
      });
      if (value === undefined || error)
        return { ...base, status: error ? "invalid" : "incomplete" };
      targets[declaration.id] = value;
    }
    const answer: GrandArchiveAnnouncementDraft = {
      variables,
      targets,
      ...(modeIds !== undefined ? { modeIds } : {}),
    };
    request.validate(answer);
    return { ...base, status: "ready", declaration: answer };
  } catch (failure) {
    if (failure instanceof GrandArchiveUnsupportedRuleError) return unavailable(failure.message);
    if (failure instanceof Error && failure.constructor === Error)
      return { ...base, status: "invalid", message: failure.message };
    throw failure;
  }
}
