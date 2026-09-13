/**
 * Shared fail-closed derivations for the Flesh and Blood priority-automation
 * gate (`always-hold` countdown).
 *
 * Live/server-authoritative mode derives eligibility from the typed
 * interaction view; local practice mode derives it from the engine's own
 * pass-only predicate (`getFabAutoPassPriorityCommand`). Both helpers return
 * `false` on any missing or ambiguous data — a window that cannot be proven
 * pass-only is never treated as pass-only.
 */
import {
  fabInteractionControl,
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_PRIORITY_MODE_ACTION_LABEL,
} from "@tcg/flesh-and-blood-server-adapter";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";
import type { FabPriorityAutomationMode } from "./state";

/** The adapter-owned Pass identity is independent of labels, ordering, and End turn. */
export function fabPassInteractionAction(
  view: EngineInteractionView | null | undefined,
): InteractionAction | null {
  if (!view || view.status !== "ready" || view.resolution) return null;
  const pass = view.actions.find(
    (action) =>
      fabInteractionControl(action)?.kind === "pass" &&
      action.enabled &&
      action.inputs.length === 0,
  );
  return pass ?? null;
}

/**
 * Fail-closed pass-only derivation from the actor-scoped interaction view.
 *
 * Eligible iff the view is `ready` (the actor can act), carries no rules
 * resolution (decisions project as `choosing` + `resolution`), exposes at
 * least one action, and every action is an enabled, input-less pass or
 * concede. `custom`-intent actions are skipped first: the adapter projects
 * the player-only settings toggles (`set-automation-preferences`,
 * `set-optional-trigger-automation`) as sourceless `custom` actions exactly
 * when the player holds priority, and the engine's own pass-only predicate
 * filters those commands out via `botEligibleFabCommands` — skipping them
 * here mirrors that filter. Defend declarations project a `choose-targets`
 * action, and the terminal Action-Phase window carries end-turn — both fail
 * the every-action test structurally. The tabletop additionally excludes the
 * Defend Step and the terminal window from presentation state, because a
 * defender with no cards and a pass-only terminal view would otherwise look
 * pass-only here while remaining deliberate player decisions in the engine
 * predicate.
 */
export function isFabPassOnlyInteractionView(
  view: EngineInteractionView | null | undefined,
): boolean {
  if (!view) return false;
  if (view.status !== "ready") return false;
  if (view.resolution) return false;
  const substantive = view.actions.filter((action) => action.intent !== "custom");
  if (substantive.length === 0) return false;
  return substantive.every(
    (action) =>
      action.enabled &&
      action.inputs.length === 0 &&
      (fabInteractionControl(action)?.kind === "pass" || action.intent === "concede"),
  );
}

/**
 * A sourceless `custom`-intent action identified by its engine-exported label.
 *
 * The adapter projects the player-only settings commands as sourceless
 * `custom` actions whose `text.key` is the engine's stable action label; with
 * three priority modes plus the one-shot arm there are several such actions,
 * so structural "the only sourceless custom" identification no longer works —
 * the label is the key.
 */
function sourcelessCustomActionForLabel(
  view: EngineInteractionView | null | undefined,
  label: string,
): InteractionAction | null {
  if (!view) return null;
  const action = view.actions.find(
    (candidate) =>
      candidate.intent === "custom" &&
      candidate.source == null &&
      candidate.enabled &&
      candidate.text.key === label,
  );
  return action ?? null;
}

/** The `set-automation-preferences` interaction action for one target mode. */
export function fabPriorityModeAction(
  view: EngineInteractionView | null | undefined,
  targetMode: FabPriorityAutomationMode,
): InteractionAction | null {
  return sourcelessCustomActionForLabel(view, FAB_PRIORITY_MODE_ACTION_LABEL[targetMode]);
}

/** The player-only command that changes automatic simultaneous-trigger ordering. */
export function fabSetAutoOrderTriggersAction(
  view: EngineInteractionView | null | undefined,
  enabled: boolean,
): InteractionAction | null {
  return sourcelessCustomActionForLabel(
    view,
    enabled
      ? FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn
      : FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOff,
  );
}

/** The player-only command that changes forced entity-target auto-select. */
export function fabSetAutoSelectSingletonTargetsAction(
  view: EngineInteractionView | null | undefined,
  enabled: boolean,
): InteractionAction | null {
  return sourcelessCustomActionForLabel(
    view,
    enabled
      ? FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOn
      : FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOff,
  );
}

/** The one-shot `arm-priority-hold` interaction action ("play and hold
 * priority"), holder-only and absent once the seat is armed. */
export function fabArmHoldAction(
  view: EngineInteractionView | null | undefined,
): InteractionAction | null {
  return sourcelessCustomActionForLabel(view, FAB_ARM_PRIORITY_HOLD_LABEL);
}

/**
 * Modes whose pass-only windows the client holds and resolves through the
 * countdown: `always-hold` holds every window; `play-and-skip` holds every
 * window except the seat's own follow-up windows, which the engine skips
 * before a view ever sees them. `auto-pass` windows are engine-drained and
 * never count down. Null/undefined (spectators, replays, unseated viewers)
 * returns false: without a projected mode the client must never auto-submit.
 */
export function holdsPassOnlyWindows(mode: FabPriorityAutomationMode | null | undefined): boolean {
  return mode === "always-hold" || mode === "play-and-skip";
}
