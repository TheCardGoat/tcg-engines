import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import { openGrandArchiveOpportunity } from "../../procedures/game-flow/opportunity.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchiveReturnPreservedCard(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommandFor<"return-preserved-card">,
): GrandArchiveCommandTransition {
  const state = context.getState();
  if (
    state.turn.playerId !== playerId ||
    state.turn.phase !== "materialize" ||
    !state.turn.materializeChoicePending
  ) {
    return context.failure(
      "illegal-command",
      "Only the turn player may replace their materialization with Preserve",
    );
  }
  const card = state.objects[command.cardId];
  if (
    !card ||
    card.ownerId !== playerId ||
    card.zone !== "material-deck" ||
    !card.states.has("preserved")
  ) {
    return context.failure(
      "illegal-command",
      "The selected card is not Preserved in this player's material deck",
    );
  }
  return context.commit([
    {
      type: "materialization-choice-consumed",
      actorId: playerId,
      cause: { kind: "command", move: "return-preserved-card" },
    },
    {
      type: "object-moved",
      objectId: card.id,
      from: "material-deck",
      to: "hand",
      entryFacing: "face-down",
      actorId: playerId,
      cause: { kind: "command", move: "return-preserved-card" },
    },
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(state, playerId, "turn-based-action"),
      cause: { kind: "rule", rule: "preserve-replaced-materialization" },
    },
  ]);
}
