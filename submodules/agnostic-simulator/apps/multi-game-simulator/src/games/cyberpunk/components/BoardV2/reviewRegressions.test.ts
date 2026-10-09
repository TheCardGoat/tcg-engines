import { expect, test } from "vite-plus/test";
import type { SideZoneViews, ZoneCardView } from "../../engine";
import { firstPages, placeSeat } from "./layout";
import { rivalTimeoutExpired } from "../GameBoard/rivalTimeout";

function legend(cardId: string, overrides: Partial<ZoneCardView> = {}): ZoneCardView {
  return {
    cardId,
    definitionId: `legend:${cardId}`,
    imageUrl: `/${cardId}.webp`,
    name: cardId,
    color: "blue",
    cardType: "legend",
    hasSellTag: false,
    rulesText: null,
    classifications: [],
    keywords: [],
    cost: null,
    effectiveCost: null,
    costEffects: [],
    power: null,
    effectivePower: null,
    activeEffects: [],
    spent: false,
    hasLag: false,
    identityHidden: false,
    faceDown: true,
    effectiveRules: [],
    attachedGear: [],
    ...overrides,
  };
}

function zones(legends: ZoneCardView[]): SideZoneViews {
  return {
    hand: [],
    field: [],
    legendArea: legends,
    trash: [],
    trashTop: null,
    fixerArea: [],
    gigArea: [],
    deckCount: 0,
    trashCount: 0,
    eddies: 0,
    spentEddies: 0,
    eddieCards: [],
    eddieCardCount: 0,
    soldThisTurn: false,
    streetCred: 0,
    gigCount: 0,
    activeEffects: [],
  };
}

test("a turn-scoped Legend peek reveals its face on a later page without making it face-up", () => {
  const legends = zones([legend("one"), legend("two"), legend("three"), legend("four")]);
  const page = { ...firstPages, legendArea: 1 };
  const hidden = placeSeat(legends, "player", false, page);
  expect(hidden[0]).toMatchObject({ zoneIndex: 3, hidden: true, peeked: false });

  const peeked = placeSeat(legends, "player", false, page, undefined, {
    ids: new Set(),
    indexes: new Set([3]),
  });
  expect(peeked[0]).toMatchObject({ zoneIndex: 3, hidden: false, peeked: true });
  expect(peeked[0]?.card.faceDown).toBe(true);
});

test("a server-hidden Legend does not disclose its identity through a peek log", () => {
  const projected = placeSeat(
    zones([legend("hidden", { identityHidden: true })]),
    "opponent",
    true,
    firstPages,
    undefined,
    { ids: new Set(["hidden"]), indexes: new Set() },
  );
  expect(projected[0]).toMatchObject({ hidden: true, peeked: false });
});

test("a face-down Legend explicitly revealed by the engine stays inspectable", () => {
  const projected = placeSeat(
    zones([legend("revealed", { revealed: true })]),
    "player",
    false,
    firstPages,
  );
  expect(projected[0]).toMatchObject({ hidden: false, peeked: true });
  expect(projected[0]?.card.faceDown).toBe(true);
});

test("a rival timeout can be claimed only during an active connected match", () => {
  const connected = { player: { status: "connected" }, opponent: { status: "connected" } } as const;
  const input = {
    humanSide: "player" as const,
    rivalSide: "opponent" as const,
    playerConnections: connected,
    onClaimRivalDrop: () => {},
    gameEnded: false,
    rivalSeconds: 0,
  };
  expect(rivalTimeoutExpired(input)).toBe(true);
  expect(rivalTimeoutExpired({ ...input, rivalSeconds: 1 })).toBe(false);
  expect(
    rivalTimeoutExpired({
      ...input,
      playerConnections: {
        ...connected,
        opponent: { status: "disconnected" },
      },
    }),
  ).toBe(false);
  expect(rivalTimeoutExpired({ ...input, gameEnded: true })).toBe(false);
  expect(rivalTimeoutExpired({ ...input, onClaimRivalDrop: undefined })).toBe(false);
});
