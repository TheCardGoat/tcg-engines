import type { GrandArchiveCommandFor } from "../command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function handleGrandArchiveConcede(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  _command: GrandArchiveCommandFor<"concede">,
): GrandArchiveCommandTransition {
  const state = context.getState();
  const remaining = state.turnOrder.filter(
    (candidate) => candidate !== playerId && state.players[candidate]?.lost === false,
  );
  const events: GrandArchiveProposedEvent[] = [
    {
      type: "player-lost",
      playerId,
      reason: "concession",
      actorId: playerId,
      gameActionKind: "special-game-action",
      cause: { kind: "command", move: "concede" },
    },
  ];
  if (remaining.length <= 1) {
    events.push({
      type: "match-finished",
      winnerIds: remaining,
      gameActionKind: "special-game-action",
      cause: { kind: "rule", rule: "last-player-standing" },
    });
  }
  return context.commit(events);
}
