import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import { grandArchiveObjectId, type GrandArchivePlayerId } from "../../game/identity.ts";
import { grandArchiveObjectHasActiveKeyword } from "../../rules/abilities/intrinsic-keywords.ts";
import type { GrandArchiveCardInstance } from "../../game/model.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchiveCompletePregameActions(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  _command: GrandArchiveCommandFor<"complete-pregame-actions">,
): GrandArchiveCommandTransition {
  const program = context.getProgram();
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
  const unbestowedFirstBoon = state.zones[playerId].pantheon.some((objectId) => {
    const object = state.objects[objectId];
    return (
      object?.facing === "face-down" &&
      grandArchiveObjectHasActiveKeyword(program, state, object, "first-boon")
    );
  });
  if (unbestowedFirstBoon) {
    return context.failure(
      "illegal-command",
      "Every First Boon must be bestowed before proceeding",
    );
  }
  const nextIndex = pregame.currentPlayerIndex + 1;
  if (nextIndex < state.turnOrder.length) {
    const nextPlayerId = state.turnOrder[nextIndex];
    if (!nextPlayerId) {
      return context.failure("illegal-command", "The next pre-game player does not exist");
    }
    return context.commit([
      {
        type: "pregame-player-advanced",
        playerId: nextPlayerId,
        playerIndex: nextIndex,
        actorId: playerId,
        cause: { kind: "command", move: "complete-pregame-actions" },
      },
    ]);
  }
  const events: GrandArchiveProposedEvent[] = [
    {
      type: "pregame-starting-cards-entered",
      actorId: playerId,
      cause: { kind: "command", move: "complete-pregame-actions" },
    },
  ];
  let barrierOffset = 0;
  for (const setupPlayerId of state.turnOrder) {
    const championId = pregame.startingChampionIds[setupPlayerId];
    const champion = championId ? state.objects[championId] : undefined;
    if (!champion || champion.zone !== "material-deck") {
      return context.failure("illegal-command", "A starting champion is no longer available");
    }
    events.push({
      type: "object-moved",
      objectId: champion.id,
      from: "material-deck",
      to: "field",
      newControllerId: setupPlayerId,
      cause: { kind: "rule", rule: "starting-champion-enters" },
    });
    const barrierDefinitionId = pregame.pantheonBarrierDefinitionIds[setupPlayerId];
    if (barrierDefinitionId) {
      const definition = program.cardsById[barrierDefinitionId];
      if (!definition) {
        return context.failure("illegal-command", "Pantheon Barrier definition is unavailable");
      }
      const barrierId = grandArchiveObjectId(`object-${state.nextObjectOrdinal + barrierOffset}`);
      barrierOffset += 1;
      const barrier: GrandArchiveCardInstance = {
        id: barrierId,
        definitionId: definition.canonicalId,
        isToken: true,
        ownerId: setupPlayerId,
        baseControllerId: setupPlayerId,
        controllerId: setupPlayerId,
        zone: "field",
        face: "default",
        facing: "face-up",
        states: new Set(),
        activationStates: new Set(),
        activationPayment: [],
        activationBindings: {},
        activationVariables: {},
        cascadeCounts: {},
        counters: {},
        damage: 0,
        incarnation: 1,
        objectVersion: 1,
      };
      events.push({
        type: "object-created",
        object: barrier,
        cause: { kind: "rule", rule: "pantheon-barrier-game-setup" },
      });
    }
  }
  return context.commit(events);
}
