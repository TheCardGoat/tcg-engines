import type { FabMoveName } from "../../moves.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES } from "../../state.ts";
import { FAB_AUTOMATION_PREFERENCE_LABELS, stablePayloadKey } from "./shared.ts";
import { instantiateBeginPlayLegalCommands } from "./play.ts";
import { instantiateActivateLegalCommands } from "./activate.ts";
import { instantiateDefendLegalCommands } from "./defend.ts";
import { instantiateAnswerDecisionLegalCommands } from "./decision.ts";
import {
  instantiateArmPriorityHoldLegalCommands,
  instantiateSetAutomationPreferencesLegalCommands,
  instantiateSetOptionalTriggerAutomationLegalCommands,
} from "./preferences.ts";
import { instantiateConcedeLegalCommands, instantiatePassLegalCommands } from "./pass.ts";
import { instantiateEndTurnLegalCommands } from "./end-turn.ts";
import type { FabLegalCommand, FabLegalCommandSource, ListLegalCommandsOptions } from "./types.ts";
import { LEGAL_COMMAND_EVALUATION_CONTEXT } from "./types.ts";

export type { FabLegalCommand, FabLegalCommandSource, ListLegalCommandsOptions } from "./types.ts";
export {
  activationQuoteForCommand,
  botEligibleFabCommands,
  rulesViewForLegalCommands,
} from "./types.ts";
export {
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_PRIORITY_MODES,
  FAB_PRIORITY_MODE_ACTION_LABEL,
} from "./shared.ts";

/**
 * Everything a per-move command instantiator may need. Move modules
 * destructure only the fields their move uses.
 */
interface FabLegalCommandContext {
  readonly state: FabRulesSnapshot;
  readonly view: ReturnType<typeof buildFabRulesView>;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
  readonly maxDefendSetSize: number;
  readonly includeConcede: boolean;
}

/**
 * Per-move legal-command instantiation, exhaustive over `FabMoveName`.
 *
 * This is the third leg of the move table: adding a move fails `tsc` at
 * command decode (`moves.ts`), at the handler router
 * (`commands/handlers/index.ts`), and here until all three own it. Move
 * availability (which move *types* a seat may take) remains the coarse
 * enumeration in `runtime-moves.ts`; this table owns the fully-instantiated
 * payloads.
 */
const fabMoveLegalCommandInstantiators: Readonly<
  Record<FabMoveName, (context: FabLegalCommandContext) => void>
> = {
  "set-optional-trigger-automation": instantiateSetOptionalTriggerAutomationLegalCommands,
  "set-automation-preferences": instantiateSetAutomationPreferencesLegalCommands,
  "arm-priority-hold": instantiateArmPriorityHoldLegalCommands,
  concede: instantiateConcedeLegalCommands,
  pass: instantiatePassLegalCommands,
  "end-turn": instantiateEndTurnLegalCommands,
  "answer-decision": instantiateAnswerDecisionLegalCommands,
  "begin-play": instantiateBeginPlayLegalCommands,
  activate: instantiateActivateLegalCommands,
  defend: instantiateDefendLegalCommands,
};

/**
 * Expand {@link FabLegalCommandSource.enumerateMoves} into concrete, probe-validated
 * command candidates for `actorId`. Used by automation strategies and practice UI.
 *
 * Notes:
 * - Card plays are announced without bundled pitch; payment is a later prompt.
 * - Equipment with defense is listed as defend candidates.
 */
export function listLegalCommands(
  runtime: FabLegalCommandSource,
  actorId: string,
  options: ListLegalCommandsOptions = {},
): FabLegalCommand[] {
  const moveNames = runtime.enumerateMoves(actorId);
  if (moveNames.length === 0) return [];

  const state = runtime.getState();
  const player = state.players[actorId];
  if (!player) return [];
  const view = buildFabRulesView(state);

  const out: FabLegalCommand[] = [];
  const seen = new Set<string>();

  const push = (command: FabLegalCommand): void => {
    const key = `${command.move}:${stablePayloadKey(command.payload)}:${command.sourceInstanceId ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(command);
  };
  const context: FabLegalCommandContext = {
    state,
    view,
    actorId,
    push,
    maxDefendSetSize: options.maxDefendSetSize ?? Number.POSITIVE_INFINITY,
    includeConcede: options.includeConcede === true,
  };
  for (const move of moveNames) {
    fabMoveLegalCommandInstantiators[move](context);
  }

  if (moveNames.includes("set-automation-preferences") && state.decision == null) {
    const profile = state.automationPreferences[actorId] ?? FAB_DEFAULT_AUTOMATION_PREFERENCES;
    const instantSources = new Map<string, string>();
    for (const command of out) {
      if (command.priorityYield?.kind !== "instant-use" || !command.sourceInstanceId) continue;
      instantSources.set(command.sourceInstanceId, command.priorityYield.canonicalId);
    }
    for (const [sourceInstanceId, canonicalId] of instantSources) {
      const yielded = profile.instantYieldCardIds.includes(canonicalId);
      push({
        move: "set-automation-preferences",
        payload: yielded
          ? { removeInstantYieldCardId: canonicalId }
          : { addInstantYieldCardId: canonicalId },
        automation: "player-only",
        sourceInstanceId,
        label: yielded
          ? FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldRemove
          : FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldAdd,
      });
    }
  }

  LEGAL_COMMAND_EVALUATION_CONTEXT.set(out, { stateID: state.stateID, view });
  return out;
}

export { listDefenderCandidates } from "./defend.ts";
