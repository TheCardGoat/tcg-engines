import type { FilteredMatchView, MatchState } from "@tcg/cyberpunk-engine";
import { logDebugSnapshot } from "../../../../lib/debug-logging";
import { isViewerHiddenIdentityDefinitionId } from "./viewerPlaceholders";

let sequence = 0;
export function logHandDebug(stage: string, details: Record<string, unknown>): void {
  const path = typeof window === "undefined" ? "" : window.location.pathname;
  const route = path.match(/\/matches\/([^/]+)\/games\/([^/]+)/);
  logDebugSnapshot("[hand-debug]", {
    schema: 1,
    side: "client",
    at: new Date().toISOString(),
    sequence: ++sequence,
    matchId: route?.[1] ?? null,
    gameId: route?.[2] ?? null,
    stage,
    ...details,
  });
}

export function summarizeHandState(state: MatchState | null) {
  if (!state) return null;
  return {
    matchId: String(state.ctx.matchId),
    version: state.ctx.stateID,
    gamePhase: state.G.gamePhase,
    players: state.ctx.playerIds.map((id, seat) => {
      const hand = state.G.players[id]?.zones.hand ?? [];
      const cards = hand.map((cardId) => state.G.cardIndex[cardId]);
      return {
        seat,
        handCount: hand.length,
        missingCardCount: cards.filter((card) => !card).length,
        hiddenIdentityCount: cards.filter(
          (card) => card && isViewerHiddenIdentityDefinitionId(card.definitionId),
        ).length,
        physicalFaceDownCount: cards.filter((card) => card?.meta.faceDown).length,
      };
    }),
  };
}

type ActorIds = { player: string; opponent: string } | undefined;

export function logHandVisibilityDiagnostics(input: {
  source: string;
  version: number;
  projection: FilteredMatchView;
  actorIds: ActorIds;
  gameId?: string;
  matchId?: string;
  previousVersion?: number;
  disposition?: "apply" | "ignore-stale";
  correlationId?: string;
}): void {
  const projectedPlayerIds = Object.keys(input.projection.players);
  const playerId = input.actorIds?.player;
  const opponentId = input.actorIds?.opponent;
  const players = projectedPlayerIds.map((projectedPlayerId) => {
    const hand = input.projection.players[projectedPlayerId]?.zones.hand;
    const cards = Array.isArray(hand) ? hand : null;
    return {
      relation:
        projectedPlayerId === playerId
          ? "player"
          : projectedPlayerId === opponentId
            ? "opponent"
            : "unmapped",
      handShape: cards ? "array" : typeof hand === "number" ? "count" : "missing",
      handCount: cards?.length ?? (typeof hand === "number" ? hand : null),
      identifiedCardCount:
        cards?.filter(
          (card) => typeof card.definitionId === "string" && card.definitionId.length > 0,
        ).length ?? null,
      hiddenIdentityCount:
        cards?.filter(
          (card) => typeof card.definitionId !== "string" || card.definitionId.length === 0,
        ).length ?? (typeof hand === "number" ? hand : null),
      physicalFaceDownCount: cards?.filter((card) => card.faceDown === true).length ?? null,
    };
  });
  const playerHand = players.find((player) => player.relation === "player");
  const mappingResolved = Boolean(playerId && opponentId);
  const ownerHandAnomaly =
    !mappingResolved ||
    !playerHand ||
    playerHand.handShape !== "array" ||
    playerHand.hiddenIdentityCount !== 0;
  if (input.projection.gamePhase !== "setup" && !ownerHandAnomaly) return;

  logHandDebug("received-projection", {
    ...(input.gameId ? { gameId: input.gameId } : {}),
    ...(input.matchId ? { matchId: input.matchId } : {}),
    source: input.source,
    previousVersion: input.previousVersion ?? null,
    disposition: input.disposition ?? "bootstrap",
    correlationId: input.correlationId ?? null,
    version: input.version,
    projectionVersion: input.projection.stateID,
    gamePhase: input.projection.gamePhase,
    actorMapping: {
      resolved: mappingResolved,
      distinct: Boolean(playerId && opponentId && playerId !== opponentId),
      playerPresent: Boolean(playerId && projectedPlayerIds.includes(playerId)),
      opponentPresent: Boolean(opponentId && projectedPlayerIds.includes(opponentId)),
      viewerSeat: playerId ? projectedPlayerIds.indexOf(playerId) : null,
    },
    players,
  });
}
