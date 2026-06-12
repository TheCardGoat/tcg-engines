import { supportsUpTo } from "@tcg/lorcana-types";
import { flattenSlottedTargets, isSlottedTargetInput } from "../slotted-targets";
import { resolveTargetBounds } from "./target-resolver";

export type ResolutionRequirementAnalysis = {
  isOptional: boolean;
  requiresExplicitTargetSelection: boolean;
  allowsExplicitEmptyTargetSelection: boolean;
  requiresAmountSelection: boolean;
  canAutoResolve: boolean;
  requiresChoiceSelection: boolean;
  requiresNamedCardSelection: boolean;
  requiresDestinationSelection: boolean;
  requiresOrderedTargetSelection: boolean;
};

type MutableResolutionRequirementAnalysis = Omit<
  ResolutionRequirementAnalysis,
  "allowsExplicitEmptyTargetSelection" | "canAutoResolve"
> & {
  targetSelectionRequirementCount: number;
  allTargetSelectionsAllowEmpty: boolean;
};

type RecordLike = Record<string, unknown>;

function asRecord(value: unknown): RecordLike | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordLike)
    : undefined;
}

function visitNestedEffects(record: RecordLike, visit: (value: unknown) => void): void {
  visit(record.effect);
  visit(record.then);
  visit(record.else);
  visit(record.ifTrue);
  visit(record.ifFalse);
  visit(record.trueEffect);
  visit(record.falseEffect);

  for (const key of ["effects", "steps", "options", "choices"]) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      for (const entry of nested) {
        visit(entry);
      }
    }
  }
}

function mergeExplicitTargetSelectionRequirement(
  analysis: MutableResolutionRequirementAnalysis,
  allowsEmpty: boolean,
): void {
  analysis.requiresExplicitTargetSelection = true;
  analysis.targetSelectionRequirementCount += 1;
  analysis.allTargetSelectionsAllowEmpty =
    analysis.targetSelectionRequirementCount === 1
      ? allowsEmpty
      : analysis.allTargetSelectionsAllowEmpty && allowsEmpty;
}

function analyzeCardTargetSelectionRequirement(
  analysis: MutableResolutionRequirementAnalysis,
  target: unknown,
): void {
  const descriptor = normalizeTargetDescriptorForRequirements(target);
  if (!descriptor || descriptor.selector !== "chosen") {
    return;
  }

  const { min } = resolveTargetBounds(descriptor.count, descriptor.selector);
  mergeExplicitTargetSelectionRequirement(analysis, min === 0);
}

function normalizeTargetDescriptorForRequirements(target: unknown): {
  selector?: string;
  count?: unknown;
} | null {
  if (!target) {
    return null;
  }

  if (target === "chosen-for-effect") {
    return null;
  }

  if (typeof target === "string") {
    if (
      target === "previous-target" ||
      target === "selected-first" ||
      target === "selected-all" ||
      target === "CARD_OWNER"
    ) {
      return null;
    }

    if (target.startsWith("CHOSEN_")) {
      return {
        selector: "chosen",
        count: 1,
      };
    }

    return null;
  }

  const record = asRecord(target);
  if (!record) {
    return null;
  }

  if (typeof record.ref === "string" || typeof record.reference === "string") {
    return null;
  }

  return {
    selector: typeof record.selector === "string" ? record.selector : undefined,
    count: record.count,
  };
}

function analyzeChosenPlayerRequirement(
  analysis: MutableResolutionRequirementAnalysis,
  value: unknown,
): void {
  if (value === "CHOSEN_PLAYER") {
    mergeExplicitTargetSelectionRequirement(analysis, false);
  }
}

function isOpponentControlledDiscardTarget(target: unknown): boolean {
  // These targets represent opponents whose discard is handled via pending
  // effects — the controller does not provide explicit targets upfront.
  // Includes OPPONENT because in a 1v1 game the opponent auto-resolves; the
  // card selection (whether made by the opponent or by the controller via
  // chosenBy:"you") is deferred to a pending effect, never provided upfront.
  return (
    target === "OPPONENT" ||
    target === "EACH_OPPONENT" ||
    target === "EACH_OTHER_PLAYER" ||
    target === "CHOSEN_OPPONENT"
  );
}

function analyzeOperationalTargetSelectionRequirement(
  analysis: MutableResolutionRequirementAnalysis,
  record: RecordLike,
): void {
  if (record.type === "discard") {
    const from = typeof record.from === "string" ? record.from : "hand";
    // When the target is an opponent (EACH_OPPONENT, etc.), discard selection
    // is handled by the opponent via pending effects — the controller does not
    // need to provide explicit targets at resolveBag time.
    if (
      (record.random !== true || record.chosen === true) &&
      from === "hand" &&
      record.amount !== "all" &&
      !isOpponentControlledDiscardTarget(record.target)
    ) {
      mergeExplicitTargetSelectionRequirement(analysis, false);
    }
  }

  if (record.type === "put-into-inkwell") {
    const source = record.source;
    if (
      source === "hand" ||
      source === "discard" ||
      source === "chosen-card-in-play" ||
      source === "chosen-character"
    ) {
      mergeExplicitTargetSelectionRequirement(analysis, false);
    }
  }
}

function analyzeAmountSelectionRequirement(
  analysis: MutableResolutionRequirementAnalysis,
  record: RecordLike,
): void {
  // Any effect registered in the up-to registry opts into chooser-selectable
  // amounts when its `amount` is wrapped as `{ type: "up-to", value: N }`.
  if (typeof record.type !== "string" || !supportsUpTo(record.type)) {
    return;
  }
  const amount = record.amount;
  if (
    amount !== null &&
    typeof amount === "object" &&
    (amount as { type?: unknown }).type === "up-to"
  ) {
    analysis.requiresAmountSelection = true;
  }
}

/**
 * Analyse what kind of player input an effect or ability needs before it can
 * fully resolve. The result drives two runtime decisions:
 *
 * 1. **`canAutoResolve`** — if `true`, the engine drains the bag entry
 *    automatically without presenting a prompt to the controller. This is
 *    set when the effect is non-optional AND requires none of:
 *    explicit target selection, choice selection, named-card selection,
 *    destination selection, or ordered-target selection.
 *
 * 2. **Deferred target selection (`chosenBy`)** — when an effect carries
 *    `chosenBy: "opponent"` or `chosenBy: "TARGET"`, target selection is
 *    handled by the opponent via a `pendingEffect` after the controller's
 *    `resolveBag` is processed. These slots are intentionally excluded from
 *    the `requiresExplicitTargetSelection` analysis so the controller's bag
 *    entry gets `canAutoResolve = true` and drains without a click.
 *
 * ### Common patterns and their outcomes
 *
 * | Pattern | `canAutoResolve` | Who clicks |
 * |---------|-----------------|------------|
 * | Mandatory, fixed target (`target: "SELF"`) | `true` | nobody — auto-drains |
 * | Mandatory, opponent-chosen target (`chosenBy: "opponent"`) | `true` | nobody on controller side; opponent resolves via `resolveEffect` |
 * | Mandatory, controller-chosen target (`target: { selector: "chosen" }`) | `false` | controller picks at `resolveBag` time |
 * | Optional (`type: "optional"`) | `false` | controller accepts/declines; if no valid targets exist the engine auto-declines |
 * | Cross-chooser optional (`type: "optional"`, `chooser: "OPPONENT"`) | `false` | controller submits plain `resolveBag`; opponent then resolves `resolveEffect` |
 *
 * ### Call sites
 *
 * - `bagEffectNeedsPlayerDecision` in `lorcana-engine-base.ts` — gate for
 *   auto-drain in `getAutoResolvableBagIdFromState`.
 * - `shouldSkipEffectWithNoValidTargets` in `optional-skip-analysis.ts` —
 *   supplementary check that forces auto-decline when any required chosen slot
 *   has zero candidates (or all options of a `choice` effect are unfillable),
 *   even when `canAutoResolve` would otherwise be `false`.
 */
export function analyzeResolutionRequirements(
  effectOrAbility: unknown,
): ResolutionRequirementAnalysis {
  const analysis: MutableResolutionRequirementAnalysis = {
    isOptional: false,
    requiresExplicitTargetSelection: false,
    requiresAmountSelection: false,
    requiresChoiceSelection: false,
    requiresNamedCardSelection: false,
    requiresDestinationSelection: false,
    requiresOrderedTargetSelection: false,
    targetSelectionRequirementCount: 0,
    allTargetSelectionsAllowEmpty: false,
  };

  const visit = (value: unknown): void => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        visit(entry);
      }
      return;
    }

    const record = asRecord(value);
    if (!record) {
      return;
    }

    if (record.type === "optional") {
      analysis.isOptional = true;
    }

    if (record.type === "choice" || record.type === "or") {
      analysis.requiresChoiceSelection = true;
    }

    if (record.type === "name-a-card") {
      analysis.requiresNamedCardSelection = true;
    }

    if (
      record.type === "scry" &&
      Array.isArray(record.destinations) &&
      record.destinations.length > 0
    ) {
      analysis.requiresDestinationSelection = true;
    }

    if (record.type === "put-on-bottom" && record.ordering === "player-choice") {
      analysis.requiresOrderedTargetSelection = true;
    }

    analyzeChosenPlayerRequirement(analysis, record.target);
    analyzeChosenPlayerRequirement(analysis, record.chooser);

    // chosenBy: "opponent" / "TARGET" — target selection is deferred to the
    // opponent (or targeted player) via a pendingEffect after the controller's
    // resolveBag resolves. Skipping the normal target analysis here keeps
    // requiresExplicitTargetSelection = false, which lets canAutoResolve = true
    // and removes the need for a controller click.  See AGENTS.md §Opponent-Chosen Effects.
    const defersTargetSelection = record.chosenBy === "opponent" || record.chosenBy === "TARGET";

    if (!defersTargetSelection) {
      for (const key of ["target", "character", "location", "from", "to", "source", "under"]) {
        analyzeCardTargetSelectionRequirement(analysis, record[key]);
      }
    }

    const amountRecord = asRecord(record.amount);
    if (amountRecord?.target !== undefined && !defersTargetSelection) {
      analyzeCardTargetSelectionRequirement(analysis, amountRecord.target);
    }

    analyzeOperationalTargetSelectionRequirement(analysis, record);
    analyzeAmountSelectionRequirement(analysis, record);
    visitNestedEffects(record, visit);
  };

  visit(effectOrAbility);

  const allowsExplicitEmptyTargetSelection =
    analysis.requiresExplicitTargetSelection &&
    analysis.targetSelectionRequirementCount > 0 &&
    analysis.allTargetSelectionsAllowEmpty;

  return {
    isOptional: analysis.isOptional,
    requiresExplicitTargetSelection: analysis.requiresExplicitTargetSelection,
    allowsExplicitEmptyTargetSelection,
    requiresAmountSelection: analysis.requiresAmountSelection,
    requiresChoiceSelection: analysis.requiresChoiceSelection,
    requiresNamedCardSelection: analysis.requiresNamedCardSelection,
    requiresDestinationSelection: analysis.requiresDestinationSelection,
    requiresOrderedTargetSelection: analysis.requiresOrderedTargetSelection,
    canAutoResolve:
      !analysis.isOptional &&
      !analysis.requiresExplicitTargetSelection &&
      !analysis.requiresChoiceSelection &&
      !analysis.requiresNamedCardSelection &&
      !analysis.requiresDestinationSelection &&
      !analysis.requiresOrderedTargetSelection,
  };
}

export function isOptionalResolution(effectOrAbility: unknown): boolean {
  return analyzeResolutionRequirements(effectOrAbility).isOptional;
}

export function requiresExplicitTargetSelection(effectOrAbility: unknown): boolean {
  return analyzeResolutionRequirements(effectOrAbility).requiresExplicitTargetSelection;
}

export function allowsExplicitEmptyTargetSelection(effectOrAbility: unknown): boolean {
  return analyzeResolutionRequirements(effectOrAbility).allowsExplicitEmptyTargetSelection;
}

export function requiresAmountSelection(effectOrAbility: unknown): boolean {
  return analyzeResolutionRequirements(effectOrAbility).requiresAmountSelection;
}

export function canAutoResolve(effectOrAbility: unknown): boolean {
  return analyzeResolutionRequirements(effectOrAbility).canAutoResolve;
}

export function hasExplicitTargetSelectionInput(targets: unknown): boolean {
  return targets !== undefined;
}

export function countExplicitTargetSelections(targets: unknown): number {
  if (typeof targets === "string") {
    return targets.length > 0 ? 1 : 0;
  }

  if (Array.isArray(targets)) {
    return targets.filter(
      (target): target is string => typeof target === "string" && target.length > 0,
    ).length;
  }

  if (isSlottedTargetInput(targets)) {
    return flattenSlottedTargets(targets).filter(
      (target) => typeof target === "string" && target.length > 0,
    ).length;
  }

  return 0;
}

export function buildMissingTargetSelectionError(
  commandName: "resolveBag" | "resolveEffect",
  effectOrAbility: unknown,
): string {
  const requirements = analyzeResolutionRequirements(effectOrAbility);
  return requirements.allowsExplicitEmptyTargetSelection
    ? `${commandName} requires explicit targets for this effect; pass targets: [] if you are choosing zero targets`
    : `${commandName} requires explicit targets for this effect`;
}
