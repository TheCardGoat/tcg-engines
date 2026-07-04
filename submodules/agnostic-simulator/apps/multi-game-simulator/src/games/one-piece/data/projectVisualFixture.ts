import {
  projectStateForSeat,
  SOUTH,
  type MatchState,
  type MatchSeat,
  type Viewer,
  type ProjectedCard,
  type ProjectedLogEntry,
  type ProjectedPlayerState,
} from "@tcg/op-engine";
import { getCard, hasCard } from "@tcg/op-cards";
import type {
  BoardToken,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorTable,
  SimulatorZone,
} from "@tcg/simulator-contract";
import type { OnePieceSeatId, OnePieceStaticBoard } from "./staticBoard.ts";
import { getDefaultOnePieceVisualFixture, type OnePieceVisualFixture } from "./visualFixtures.ts";

const SEAT_TO_BOARD_ID: Record<MatchSeat, OnePieceSeatId> = {
  north: "opponent",
  south: "player",
};

const PHASE_LABELS: Record<string, string> = {
  setup: "Setup",
  refresh: "Refresh Phase",
  draw: "Draw Phase",
  don: "DON!! Phase",
  main: "Main Phase",
  end: "End Phase",
  finished: "Finished",
};

const ONE_PIECE_CARD_CDN_BASE = "https://cdn.tcg.online/public/one-piece/cards";

export function buildDefaultOnePieceBoard(): OnePieceStaticBoard {
  return buildOnePieceBoardFromFixture(getDefaultOnePieceVisualFixture());
}

export function buildOnePieceBoardFromFixture(fixture: OnePieceVisualFixture): OnePieceStaticBoard {
  const state = fixture.buildState();
  return buildOnePieceBoardFromState(state, {
    id: fixture.id,
    label: fixture.label,
    description: fixture.description,
    logPrefix: `Loaded visual fixture: ${fixture.label}.`,
  });
}

export function buildOnePieceBoardFromState(
  state: MatchState,
  fixture: {
    id: string;
    label: string;
    description: string;
    logPrefix?: string;
    viewer?: Viewer;
  },
): OnePieceStaticBoard {
  const view = projectStateForSeat(state, fixture.viewer ?? SOUTH);
  const players = {
    opponent: view.players.north,
    player: view.players.south,
  };

  const entities: SimulatorEntity[] = [];
  const zones: SimulatorZone[] = [];
  const donTokens = {
    opponent: donTokensFor(players.opponent),
    player: donTokensFor(players.player),
  };

  addSeatZones({ seatId: "opponent", player: players.opponent, zones, entities });
  addSeatZones({ seatId: "player", player: players.player, zones, entities });

  return {
    table: {
      status: {
        activeSeatId: SEAT_TO_BOARD_ID[view.activeSeat],
        phase: PHASE_LABELS[view.phase] ?? view.phase,
        turn: view.turnNumber,
        stateVersion: state.eventSequence + state.logSequence + 1,
      },
      seats: [
        seatFor("opponent", players.opponent, view.activeSeat === "north"),
        seatFor("player", players.player, view.activeSeat === "south"),
      ],
      zones,
    },
    entities,
    eventLog: eventLogFor(fixture, view.logs),
    donTokens,
    fixture: {
      id: fixture.id,
      label: fixture.label,
      description: fixture.description,
    },
  };
}

function addSeatZones({
  seatId,
  player,
  zones,
  entities,
}: {
  seatId: OnePieceSeatId;
  player: ProjectedPlayerState;
  zones: SimulatorZone[];
  entities: SimulatorEntity[];
}) {
  const hand = entitiesForCards(seatId, "hand", player.hand);
  const leader = entitiesForCards(seatId, "leader", [player.leader]);
  const characters = entitiesForCards(
    seatId,
    "characters",
    player.characters.filter((card): card is ProjectedCard => Boolean(card)),
  );
  const stage = entitiesForCards(seatId, "stage", player.stage ? [player.stage] : []);
  const deck = entitiesForCards(seatId, "deck", player.deckTop ? [player.deckTop] : []);
  const trash = entitiesForCards(seatId, "trash", player.trash.slice(-1));
  const life = entitiesForCards(seatId, "life", player.life.slice(0, 1));
  const donDeck =
    player.donDeckCount > 0 ? [resourceEntity(`${seatId}-don-deck-top`, seatId, ["hidden"])] : [];
  const donArea = donAreaEntities(seatId, player);

  entities.push(
    ...hand,
    ...leader,
    ...characters,
    ...stage,
    ...deck,
    ...trash,
    ...life,
    ...donDeck,
    ...donArea,
  );

  zones.push(
    zone(seatId, "hand", "Hand", "hand", "owner", hand, player.handCount, "fan"),
    zone(seatId, "leader", "Leader", "leader", "public", leader),
    zone(
      seatId,
      "characters",
      "Character Area",
      "battlefield",
      "public",
      characters,
      characters.length,
      "row",
    ),
    zone(seatId, "stage", "Stage Card", "support", "public", stage),
    zone(seatId, "deck", "Main Deck", "deck", "secret", deck, player.deckCount, "stack"),
    zone(seatId, "trash", "Trash", "discard", "public", trash, player.trash.length, "stack"),
    zone(seatId, "life", "Life", "life", "secret", life, player.lifeCount, "stack"),
    zone(
      seatId,
      "don-deck",
      "DON!! Deck",
      "resource",
      "public",
      donDeck,
      player.donDeckCount,
      "stack",
    ),
    zone(
      seatId,
      "don-area",
      "DON!! Area",
      "resource",
      "public",
      donArea,
      player.activeDon + player.restedDon,
      "row",
    ),
  );
}

function entitiesForCards(
  seatId: OnePieceSeatId,
  zoneSuffix: string,
  cards: readonly ProjectedCard[],
): SimulatorEntity[] {
  return cards.map((card, index) =>
    entityForCard(card, seatId, `${seatId}-${zoneSuffix}-${card.instanceId ?? `hidden-${index}`}`),
  );
}

function entityForCard(
  card: ProjectedCard,
  ownerId: OnePieceSeatId,
  fallbackId: string,
): SimulatorEntity {
  if (card.hidden) {
    return {
      id: fallbackId,
      title: "Hidden card",
      subtitle: "Hidden card",
      kind: "card",
      ownerId,
      face: "hidden",
      states: ["hidden"],
      stats: [],
      traits: [],
    };
  }

  const states: SimulatorEntity["states"] = [card.rested ? "rested" : "ready"];
  if (card.attachedDon > 0) {
    states.push("attached");
  }

  return {
    id: card.instanceId ?? fallbackId,
    title: card.name ?? "Unknown card",
    subtitle: subtitleFor(card),
    kind: kindFor(card),
    ownerId,
    face: "public",
    states,
    stats: statsFor(card),
    traits: [],
    imageUrl: imageUrlForCard(card.cardId),
    frameStyle: { color: frameColorFor(ownerId, card.zone) },
    overlayBadges:
      card.attachedDon > 0
        ? [
            {
              label: `+${card.attachedDon * 1000}`,
              color: "#b4232f",
              position: "tr",
            },
          ]
        : undefined,
    dataAttributes: {
      "data-card-printing-id": card.cardId ?? undefined,
      "data-zone": card.zone,
    },
  };
}

function imageUrlForCard(cardId: string | null): string | undefined {
  if (!cardId || !hasCard(cardId)) {
    return undefined;
  }

  const card = getCard(cardId);
  const printing = card.printings[0];
  if (!printing) {
    return undefined;
  }

  return onePiecePrintingImageUrl(printing);
}

function onePiecePrintingImageUrl(printing: { id: string; setCode: string }): string {
  return `${ONE_PIECE_CARD_CDN_BASE}/${encodeURIComponent(
    printing.setCode.toUpperCase(),
  )}/${encodeURIComponent(printing.id)}.webp`;
}

function statsFor(card: ProjectedCard): SimulatorEntity["stats"] {
  return [
    card.cost !== null ? { label: "Cost", value: String(card.cost) } : null,
    card.power !== null ? { label: "Power", value: String(card.power) } : null,
    card.attachedDon > 0 ? { label: "DON!!", value: `${card.attachedDon} attached` } : null,
  ].filter((stat): stat is SimulatorEntity["stats"][number] => Boolean(stat));
}

function kindFor(card: ProjectedCard): SimulatorEntity["kind"] {
  switch (card.zone) {
    case "leader":
      return "leader";
    case "character":
      return "character";
    default:
      return "card";
  }
}

function subtitleFor(card: ProjectedCard): string {
  switch (card.zone) {
    case "leader":
      return "Leader";
    case "character":
      return "Character";
    case "stage":
      return "Stage";
    case "hand":
      return "Hand card";
    case "trash":
      return "Trash top";
    case "deck":
      return "Deck";
    case "life":
      return "Life";
  }
}

function frameColorFor(ownerId: OnePieceSeatId, zoneValue: ProjectedCard["zone"]): string {
  if (zoneValue === "stage") {
    return "#d99b31";
  }
  return ownerId === "player" ? "#b4232f" : "#7c3aed";
}

function resourceEntity(
  id: string,
  ownerId: OnePieceSeatId,
  states: SimulatorEntity["states"],
): SimulatorEntity {
  return {
    id,
    title: "DON!!",
    subtitle: "Resource",
    kind: "resource",
    ownerId,
    face: "public",
    states,
    stats: [{ label: "Type", value: "DON!!" }],
    traits: ["DON!!"],
    frameStyle: { color: "#d99b31" },
  };
}

function donAreaEntities(seatId: OnePieceSeatId, player: ProjectedPlayerState): SimulatorEntity[] {
  return [
    ...Array.from({ length: player.activeDon }, (_, index) =>
      resourceEntity(`${seatId}-don-active-${index + 1}`, seatId, ["ready"]),
    ),
    ...Array.from({ length: player.restedDon }, (_, index) =>
      resourceEntity(`${seatId}-don-rested-${index + 1}`, seatId, ["rested"]),
    ),
  ];
}

function zone(
  ownerId: OnePieceSeatId,
  suffix: string,
  label: string,
  role: SimulatorZone["role"],
  visibility: SimulatorZone["visibility"],
  entities: readonly SimulatorEntity[],
  count = entities.length,
  layoutHint?: SimulatorZone["layoutHint"],
): SimulatorZone {
  return {
    id: `${ownerId}-${suffix}`,
    label,
    role,
    ownerId,
    visibility,
    entityIds: entities.map((entity) => entity.id),
    count,
    hint: `${label} for ${ownerId}.`,
    ...(layoutHint ? { layoutHint } : {}),
  };
}

function seatFor(
  seatId: OnePieceSeatId,
  player: ProjectedPlayerState,
  active: boolean,
): SimulatorTable["seats"][number] {
  return {
    id: seatId,
    label: seatId === "player" ? "You" : "Opponent",
    role: seatId === "player" ? "human" : "agent",
    perspective: seatId === "player" ? "bottom" : "top",
    counters: [
      { label: "Life", value: String(player.lifeCount) },
      { label: "Deck", value: String(player.deckCount) },
      { label: "Hand", value: String(player.handCount) },
      { label: "DON!!", value: `${player.activeDon + player.restedDon}/10` },
    ],
    connectionStatus: active ? "thinking" : "online",
  };
}

function donTokensFor(player: ProjectedPlayerState): BoardToken[] {
  return [
    { label: "Active", value: String(player.activeDon), state: "ready" },
    { label: "Rested", value: String(player.restedDon), state: "rested" },
    { label: "DON!! Deck", value: String(player.donDeckCount), state: "hidden" },
  ];
}

function eventLogFor(
  fixture: {
    id: string;
    label: string;
    logPrefix?: string;
  },
  logs: readonly ProjectedLogEntry[],
): SimulatorEventLogEntry[] {
  return [
    {
      id: `fixture:${fixture.id}`,
      turn: 0,
      phase: "Fixture",
      timestamp: "2026-06-26T12:00:00.000Z",
      message: fixture.logPrefix ?? `Loaded visual fixture: ${fixture.label}.`,
      tags: ["system"],
    },
    ...logs.slice(-5).map((entry, index) => ({
      id: entry.id || `engine-log-${index}`,
      turn: entry.turn,
      phase: PHASE_LABELS[entry.phase] ?? entry.phase,
      seatId: seatIdForActor(entry.actor),
      timestamp: "2026-06-26T12:00:00.000Z",
      message: entry.message,
      tags: ["system"] as SimulatorEventLogEntry["tags"],
      entityIds: [entry.sourceInstanceId, ...entry.targetIds].filter((id): id is string =>
        Boolean(id),
      ),
    })),
  ];
}

function seatIdForActor(actor: ProjectedLogEntry["actor"]): OnePieceSeatId | undefined {
  if (actor === "north") {
    return "opponent";
  }
  if (actor === "south") {
    return "player";
  }
  return undefined;
}
