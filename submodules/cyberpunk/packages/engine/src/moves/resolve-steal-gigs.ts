import type { GigDieId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseGigsToStealPendingChoice } from "../types/match-state.ts";
import { getEffectivePower } from "../active-effects/index.ts";
import { performGigSteal } from "./resolve-attack.ts";
import { tryGetDefinition } from "../state/card-registry.ts";

export interface ResolveStealGigsInput extends MoveInput {
  args: {
    dieIds: string[];
  };
}

/**
 * Resolves a `chooseGigsToSteal` pending choice. Validates the picked die
 * ids against the snapshotted eligible pool and the required count, then
 * delegates to {@link performGigSteal} to apply the steal, fire triggers,
 * and finalize the attack state.
 */
export const resolveStealGigsMove: MoveDefinition<ResolveStealGigsInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseGigsToSteal") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseGigsToSteal") {
      return {
        valid: false,
        error: "No chooseGigsToSteal pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }

    const typed = choice as ChooseGigsToStealPendingChoice;
    const { dieIds } = input.args;

    if (new Set(dieIds).size !== dieIds.length) {
      return { valid: false, error: "Duplicate die ids", errorCode: "DUPLICATE_DIE_IDS" };
    }
    if (dieIds.length !== typed.payload.count) {
      return {
        valid: false,
        error: `Must select exactly ${typed.payload.count} die/dice`,
        errorCode: "INVALID_AMOUNT",
      };
    }
    const eligible = new Set(typed.payload.eligibleDieIds.map((id) => id as string));
    for (const id of dieIds) {
      if (!eligible.has(id)) {
        return { valid: false, error: `Die ${id} is not eligible`, errorCode: "INVALID_DIE" };
      }
    }
    if (!state.G.attackState) {
      return { valid: false, error: "No attack in progress", errorCode: "NO_ATTACK" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const attack = state.G.attackState;
    if (!attack) return;
    const attackerInst = state.G.cardIndex[attack.attackerId as string];
    const attackerName = attackerInst
      ? (tryGetDefinition(attackerInst.definitionId)?.displayName ?? "")
      : "";
    const attackerPower = getEffectivePower(
      state as import("../types/match-state.ts").MatchState,
      attack.attackerId as string,
    );
    operations.game.setPendingChoice(undefined);
    performGigSteal({
      state,
      operations,
      attack,
      gigIds: input.args.dieIds.map((id) => id as GigDieId),
      playerId,
      attackerName,
      attackerPower,
    });
    operations.game.setAttackState(null);
    operations.log.emit({
      type: "resolveStealGigs",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      attackerName,
      attackerPower,
      stolenCount: input.args.dieIds.length,
    });
  },
};
