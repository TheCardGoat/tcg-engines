import type { FabMatchState } from "../../state.ts";
import { opponentOf } from "../../state.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import type { FabEndTurnResult } from "./types.ts";
import { failure, process } from "./helpers.ts";
import { advanceFabEndTurnProcedure } from "./advance.ts";
import { arsenalHasRoom } from "../../rules/arsenal-capacity.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";

export function beginFabEndTurnProcedure(
  current: FabMatchState,
  actorId: string,
  arsenalCardId: string | null,
  options: FabEventTransactionOptions,
  traverse = false,
  chooseArsenal = false,
): FabEndTurnResult {
  if (current.decision) {
    return failure(current, "Resolve the pending decision first.", "decision_pending");
  }
  if (actorId !== current.activePlayerId) {
    return failure(current, "Only the turn player can end the turn.", "not_active_player");
  }
  if (current.combat?.open) {
    return failure(current, "Cannot end the turn while the combat chain is open.", "combat_open");
  }
  if (current.rulesStack.length > 0 || current.rulesProcess) {
    return failure(
      current,
      "Resolve the current rules process before ending the turn.",
      "rules_process_pending",
    );
  }
  if (
    arsenalCardId &&
    (!current.containers.zonesByPlayerId[actorId]!.hand.includes(arsenalCardId) ||
      !arsenalHasRoom(current, actorId))
  )
    return failure(current, "That card cannot be placed into arsenal.", "illegal_arsenal_card");

  const state = mutateInPlace(current, (draft) => {
    draft.stateID += 1;
    draft.counters.process += 1;
    const processId = `process-${draft.counters.process}` as const;
    // CR "take an extra turn after this one": consume one queued extra turn so
    // the same seat remains active; otherwise pass to the sole opponent (1v1).
    const actor = draft.players[actorId];
    let nextPlayerId = opponentOf(draft, actorId);
    if (actor && actor.extraTurnsQueued > 0) {
      actor.extraTurnsQueued -= 1;
      nextPlayerId = actorId;
    }
    startFabRulesProcess(
      draft,
      process(processId, {
        kind: "end-turn",
        actorId,
        nextPlayerId,
        stage: "end-phase",
        eventGroups: [],
        pitchOrders: {},
        bloodDebtCandidateRefs: [],
        arsenalDecisionResolved: !chooseArsenal || arsenalCardId !== null,
        arsenalCardId,
        heaveDecisionResolved: false,
        heaveInstanceId: null,
        traverse,
      }),
    );
  });
  advanceFabEndTurnProcedure(state, options);
  return { accepted: true, state };
}
