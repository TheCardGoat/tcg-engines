import { flattenGrandArchiveAbilities, grandArchiveObjectFace } from "../../game/card-runtime.ts";
import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchiveStartPregameCard(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  command: GrandArchiveCommandFor<"start-pregame-card">,
): GrandArchiveCommandTransition {
  const state = context.getState();
  const pregame = state.pregame;
  if (
    state.status !== "pregame" ||
    !pregame ||
    pregame.stage !== "player-actions" ||
    state.turnOrder[pregame.currentPlayerIndex] !== playerId
  ) {
    return context.failure("illegal-command", "Player does not have the pre-game action turn");
  }
  const card = state.objects[command.cardId];
  if (!card || card.ownerId !== playerId || card.zone !== "material-deck") {
    return context.failure(
      "illegal-command",
      "Pre-game setup cards must be in the player's material deck",
    );
  }
  const face = grandArchiveObjectFace(context.getProgram(), card);
  const mayStartOnField = flattenGrandArchiveAbilities(face.abilities).some(
    (ability) =>
      ability.kind === "game-setup" &&
      ability.rule.kind === "optional-start-on-field" &&
      ability.rule.from === "material-deck" &&
      ability.rule.condition === "source-in-starting-deck",
  );
  if (!mayStartOnField) {
    return context.failure("illegal-command", "This card has no optional pre-game field action");
  }
  return context.commit([
    {
      type: "object-moved",
      objectId: card.id,
      from: "material-deck",
      to: "field",
      newControllerId: playerId,
      actorId: playerId,
      cause: { kind: "command", move: "start-pregame-card" },
    },
  ]);
}
