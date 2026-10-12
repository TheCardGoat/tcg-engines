import { expect, test } from "vite-plus/test";
import type { LiveBoardState } from "../board-types";
import { arenaLayout, CARD_RATIO, supportRails } from "./layout";
import { arenaZones } from "./zones";

function boardWith(accessories: number, resources: number): LiveBoardState {
  return {
    cards: [
      ...Array.from({ length: accessories }, () => "accessory"),
      ...Array.from({ length: resources }, () => "resource"),
    ].map((zone, i) => ({
      instanceId: String(i),
      zone,
      controller: "player-one",
      ready: i % 2 === 0,
      faceDown: false,
      definitionId: null,
      name: "Card",
      clashDamage: 0,
      phaseDamage: 0,
    })),
    players: {
      "player-one": { name: "You", health: 30, maxHealth: 30, handSize: 0, deckSize: 30 },
      "player-two": { name: "Opponent", health: 30, maxHealth: 30, handSize: 0, deckSize: 30 },
    },
    activePlayer: "player-one",
    turnNumber: 1,
    phaseName: "primary",
    portalOpen: false,
    clash: null,
    standbyCount: 0,
  };
}

test("support row gives space to either populated zone and keeps empty drop targets reachable", () => {
  for (const [a, r] of [
    [0, 12],
    [12, 0],
    [2, 12],
    [12, 2],
    [0, 0],
  ]) {
    const rails = supportRails(boardWith(a, r), "player-one", 1000);
    expect(rails.accessory.width).toBeGreaterThanOrEqual(160);
    expect(rails.resource.width).toBeGreaterThanOrEqual(160);
    expect(
      rails.resource.center -
        rails.resource.width / 2 -
        (rails.accessory.center + rails.accessory.width / 2),
    ).toBeCloseTo(24);
    if (a > r) expect(rails.accessory.width).toBeGreaterThan(rails.resource.width);
    if (r > a) expect(rails.resource.width).toBeGreaterThan(rails.accessory.width);
  }
});

test("crowded upright and engaged cards stay within the same zones used by drop targets", () => {
  for (const [a, r] of [
    [12, 2],
    [2, 16],
    [15, 15],
  ]) {
    const board = boardWith(a, r);
    const zones = arenaZones(board, "player-one", false, 700);
    const placed = arenaLayout(board, "player-one", false, 0, 700);
    for (const card of placed) {
      const zone = zones.find(
        (zone) => zone.seat === "player-one" && zone.zone === card.card.zone,
      )!;
      const half = (card.height * (card.card.ready ? CARD_RATIO : 1)) / 2;
      expect(card.x - half).toBeGreaterThanOrEqual(zone.x - zone.width / 2);
      expect(card.x + half).toBeLessThanOrEqual(zone.x + zone.width / 2);
      expect(card.y).toBe(zone.y);
      expect(card.height).toBe(104);
    }
  }
});

test("compact payment reveals only the viewer's board resources", () => {
  const board = boardWith(2, 6);
  board.cards.push({
    ...board.cards[2]!,
    instanceId: "opposing-resource",
    controller: "player-two",
  });
  expect(
    arenaLayout(board, "player-one", true, 0, 1000).filter((p) => p.card.zone === "resource"),
  ).toHaveLength(0);
  const payment = arenaLayout(board, "player-one", true, 0, 1000, true);
  expect(payment.filter((p) => p.card.zone === "resource")).toHaveLength(6);
  expect(
    payment
      .filter((p) => p.card.zone === "resource")
      .every((p) => p.card.controller === "player-one"),
  ).toBe(true);
  expect(payment.some((p) => p.card.zone === "accessory")).toBe(false);
});
