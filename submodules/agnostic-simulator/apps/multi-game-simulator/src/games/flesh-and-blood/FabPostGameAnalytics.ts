import type { FabMoveLog } from "@tcg/flesh-and-blood-engine/simulator";

import type {
  FabCardSummary,
  FabPostGameSessionData,
  FabSummaryComparison,
  FabTurnSummary,
} from "./FabPostGameSummary.model";
import type { FabPresentationState } from "./state";

interface FabSummaryTelemetryEntry {
  readonly id: number;
  readonly recordedAt: number;
  readonly moveLogs: readonly FabMoveLog[];
}

interface PlayerTotals {
  attacks: number;
  hits: number;
  attackDamage: number;
  cardsPlayed: number;
  cardsPitched: number;
  cardsDefended: number;
  resourcesGenerated: number;
}

interface CardTotals {
  played: number;
  pitched: number;
  defended: number;
  hits: number;
}

interface MutableTurnTotals {
  cardsPlayed: number;
  cardsPitched: number;
  resourcesGenerated: number;
  damageDealt: number;
  cardsDefended: number;
}

function emptyPlayerTotals(): PlayerTotals {
  return {
    attacks: 0,
    hits: 0,
    attackDamage: 0,
    cardsPlayed: 0,
    cardsPitched: 0,
    cardsDefended: 0,
    resourcesGenerated: 0,
  };
}

function emptyTurnTotals(): MutableTurnTotals {
  return {
    cardsPlayed: 0,
    cardsPitched: 0,
    resourcesGenerated: 0,
    damageDealt: 0,
    cardsDefended: 0,
  };
}

function stringValue(
  values: Readonly<Record<string, string | number | boolean | null>> | undefined,
  key: string,
): string | null {
  const value = values?.[key];
  return typeof value === "string" ? value : null;
}

function numberValue(
  values: Readonly<Record<string, string | number | boolean | null>> | undefined,
  key: string,
): number {
  const value = values?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function comparisonRows(
  viewer: PlayerTotals,
  opponent: PlayerTotals,
): readonly FabSummaryComparison[] {
  return [
    {
      id: "attack-damage",
      label: "Attack damage",
      viewer: String(viewer.attackDamage),
      opponent: String(opponent.attackDamage),
      source: "session",
    },
    {
      id: "hits-attacks",
      label: "Hits / attacks",
      viewer: `${viewer.hits} / ${viewer.attacks}`,
      opponent: `${opponent.hits} / ${opponent.attacks}`,
      source: "session",
    },
    {
      id: "cards-defended",
      label: "Cards defended",
      viewer: String(viewer.cardsDefended),
      opponent: String(opponent.cardsDefended),
      source: "session",
    },
    {
      id: "cards-pitched",
      label: "Cards pitched",
      viewer: String(viewer.cardsPitched),
      opponent: String(opponent.cardsPitched),
      source: "session",
    },
  ];
}

function cardPresentation(
  presentation: FabPresentationState,
  viewerId: string,
): ReadonlyMap<string, { readonly id: string; readonly imageUrl?: string }> {
  const byName = new Map<string, { readonly id: string; readonly imageUrl?: string }>();
  for (const card of Object.values(presentation.cards)) {
    if (card.ownerId !== viewerId) continue;
    const definition = presentation.cardDefinitions[card.cardId];
    if (!definition || byName.has(definition.name)) continue;
    byName.set(definition.name, {
      id: card.cardId,
      ...(definition.imageUrl ? { imageUrl: definition.imageUrl } : {}),
    });
  }
  return byName;
}

/**
 * Project persisted, viewer-safe semantic receipts into post-game analytics.
 * A truncated receipt window fails closed so partial games are never presented
 * as complete statistics.
 */
export function projectFabPostGameSessionAnalytics({
  telemetry,
  presentation,
  viewerId,
}: {
  readonly telemetry: readonly FabSummaryTelemetryEntry[];
  readonly presentation: FabPresentationState;
  readonly viewerId: string;
}): FabPostGameSessionData | null {
  if (telemetry.length === 0 || telemetry[0]?.id !== 1) return null;

  const opponentId = presentation.players.find((playerId) => playerId !== viewerId);
  if (!opponentId) return null;

  const totals = new Map<string, PlayerTotals>([
    [viewerId, emptyPlayerTotals()],
    [opponentId, emptyPlayerTotals()],
  ]);
  const viewerTurns = new Map<number, MutableTurnTotals>();
  const playerCards = new Map<string, Map<string, CardTotals>>();

  const totalsFor = (playerId: string): PlayerTotals | null => totals.get(playerId) ?? null;
  const turnFor = (turnNumber: number): MutableTurnTotals => {
    const current = viewerTurns.get(turnNumber);
    if (current) return current;
    const next = emptyTurnTotals();
    viewerTurns.set(turnNumber, next);
    return next;
  };
  const cardFor = (playerId: string, name: string): CardTotals => {
    const viewerCards = playerCards.get(playerId) ?? new Map<string, CardTotals>();
    playerCards.set(playerId, viewerCards);
    const current = viewerCards.get(name);
    if (current) return current;
    const next = { played: 0, pitched: 0, defended: 0, hits: 0 };
    viewerCards.set(name, next);
    return next;
  };

  for (const entry of telemetry) {
    for (const log of entry.moveLogs) {
      for (const message of log.public) {
        const values = message.values;
        switch (message.key) {
          case "flesh-and-blood.play": {
            const actorId = stringValue(values, "actorId");
            const cardName = stringValue(values, "cardName");
            if (!actorId || !cardName) break;
            const player = totalsFor(actorId);
            if (!player) break;
            player.cardsPlayed += 1;
            cardFor(actorId, cardName).played += 1;
            if (actorId === viewerId) {
              turnFor(log.turnNumber).cardsPlayed += 1;
            }
            break;
          }
          case "flesh-and-blood.pitch": {
            const playerId = stringValue(values, "playerId");
            const cardName = stringValue(values, "cardName");
            if (!playerId || !cardName) break;
            const player = totalsFor(playerId);
            if (!player) break;
            const resources = numberValue(values, "resources");
            player.cardsPitched += 1;
            player.resourcesGenerated += resources;
            cardFor(playerId, cardName).pitched += 1;
            if (playerId === viewerId) {
              const turn = turnFor(log.turnNumber);
              turn.cardsPitched += 1;
              turn.resourcesGenerated += resources;
            }
            break;
          }
          case "flesh-and-blood.defend": {
            const actorId = stringValue(values, "actorId");
            const cardName = stringValue(values, "cardName");
            if (!actorId || !cardName) break;
            const player = totalsFor(actorId);
            if (!player) break;
            player.cardsDefended += 1;
            cardFor(actorId, cardName).defended += 1;
            if (actorId === viewerId) {
              turnFor(log.turnNumber).cardsDefended += 1;
            }
            break;
          }
          case "flesh-and-blood.attack": {
            const actorId = stringValue(values, "actorId");
            if (!actorId) break;
            const player = totalsFor(actorId);
            if (player) player.attacks += 1;
            break;
          }
          case "flesh-and-blood.combat.hit": {
            const targetId = stringValue(values, "targetName");
            const cardName = stringValue(values, "cardName");
            if (!targetId || !cardName || !totals.has(targetId)) break;
            const attackerId = targetId === viewerId ? opponentId : viewerId;
            const player = totalsFor(attackerId);
            if (!player) break;
            const damage = numberValue(values, "damage");
            player.hits += 1;
            player.attackDamage += damage;
            cardFor(attackerId, cardName).hits += 1;
            if (attackerId === viewerId) {
              turnFor(log.turnNumber).damageDealt += damage;
            }
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const cardsFor = (playerId: string): readonly FabCardSummary[] => {
    const presentationByName = cardPresentation(presentation, playerId);
    return [...(playerCards.get(playerId) ?? new Map<string, CardTotals>()).entries()]
      .map(([name, card]) => {
        const identity = presentationByName.get(name);
        return {
          id: identity?.id ?? `session:${name}`,
          name,
          ...(identity?.imageUrl ? { imageUrl: identity.imageUrl } : {}),
          ...card,
          source: "session" as const,
        };
      })
      .sort((left, right) => {
        const leftUses = left.played + left.pitched + left.defended;
        const rightUses = right.played + right.pitched + right.defended;
        return rightUses - leftUses || left.name.localeCompare(right.name);
      });
  };

  const turns: readonly FabTurnSummary[] = Array.from(
    { length: Math.max(1, presentation.turnNumber) },
    (_, index) => {
      const turn = index + 1;
      return {
        turn,
        ...(viewerTurns.get(turn) ?? emptyTurnTotals()),
        cardsPlayedFromArsenal: 0,
        source: "session" as const,
      };
    },
  );
  const firstRecordedAt = telemetry[0]?.recordedAt ?? 0;
  const lastRecordedAt = telemetry.at(-1)?.recordedAt ?? firstRecordedAt;

  return {
    durationSeconds: Math.max(0, Math.round((lastRecordedAt - firstRecordedAt) / 1000)),
    comparison: comparisonRows(totals.get(viewerId)!, totals.get(opponentId)!),
    turns,
    cards: cardsFor(viewerId),
    opponentCards: cardsFor(opponentId),
  };
}
