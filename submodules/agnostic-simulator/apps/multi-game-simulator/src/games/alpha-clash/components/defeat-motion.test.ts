import { expect, test } from "vite-plus/test";
import type { LiveBoardCard } from "./board-types";
import { detectDefeats, type AnchorRect } from "./defeat-motion";

let key = 0;
const nextKey = () => ++key;

const card = (overrides: Partial<LiveBoardCard>): LiveBoardCard => ({
  instanceId: "s1",
  zone: "clash",
  controller: "player-one",
  ready: true,
  faceDown: false,
  definitionId: "ac-ac1-027",
  name: "Sonoro",
  clashDamage: 0,
  phaseDamage: 0,
  ...overrides,
});

const anchor: AnchorRect = { id: "s1", left: 700, top: 400, width: 120, height: 168 };

test("a clash card that left the board is defeated at its last spot", () => {
  const defeats = detectDefeats(
    new Map([["s1", card({})]]),
    [],
    new Map([["s1", anchor]]),
    new Map([["player-one", { x: 1310, y: 690 }]]),
    nextKey,
  );
  expect(defeats).toHaveLength(1);
  expect(defeats[0]).toMatchObject({
    instanceId: "s1",
    fromX: 760,
    fromY: 484,
    fromWidth: 120,
    fromHeight: 168,
    toX: 1310,
    toY: 690,
    name: "Sonoro",
  });
});

test("a clash card now in Oblivion counts as defeated; a bounce to hand does not", () => {
  const oblivion = card({ zone: "oblivion" });
  const bounced = card({ instanceId: "s2", zone: "hand" });
  const defeats = detectDefeats(
    new Map([
      ["s1", card({})],
      ["s2", card({ instanceId: "s2" })],
    ]),
    [oblivion, bounced],
    new Map([["s1", anchor]]),
    new Map(),
    nextKey,
  );
  expect(defeats).toHaveLength(1);
  expect(defeats[0].instanceId).toBe("s1");
  // no Oblivion anchor known: the motion collapses in place instead of arcing
  expect(defeats[0].toY).toBe(anchor.top);
});

test("non-Clash cards, unknown spots, and untouched cards are skipped", () => {
  const defeats = detectDefeats(
    new Map([
      ["r1", card({ instanceId: "r1", zone: "resource" })],
      ["s1", card({})],
    ]),
    [card({ instanceId: "r1", zone: "oblivion" }), card({})],
    new Map([["r1", anchor]]),
    new Map(),
    nextKey,
  );
  expect(defeats).toHaveLength(0);
});
