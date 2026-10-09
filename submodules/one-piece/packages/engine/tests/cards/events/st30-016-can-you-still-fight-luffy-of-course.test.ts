import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["leader", "character"])(
  "Counter protects %s and both named base6000 Characters allow a draw",
  (kind) => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST30-016"],
        activeDon: 1,
        character: [{ cardId: "ST30-007", rested: true }, "ST30-012"],
        deck: ["ST02-002", "ST02-012"],
      },
      { character: [{ cardId: "ST02-013", attachedDon: kind === "leader" ? 0 : 1 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target =
      kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST30-007");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), target);
    e.asSouth().chooseCounter("ST30-016");
    e.asSouth().chooseTargets(target);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
  },
);

test.each([
  ["ST30-007", "ST30-007"],
  ["ST30-012", "ST30-012"],
  ["ST13-011", "ST30-012"],
])("missing a named base6000 Character prevents only the draw: %s/%s", (first, second) => {
  const e = OnePieceTestEngine.create(
    {
      hand: ["ST30-016"],
      activeDon: 1,
      character: [first, second],
      deck: ["ST02-002", "ST02-012"],
    },
    { character: ["ST02-013"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
  e.asSouth().chooseCounter("ST30-016");
  e.asSouth().chooseTargets(e.leader("south"));
  expect(e.getView("south").players.south.handCount).toBe(0);
  expect(e.getView("south").players.south.lifeCount).toBe(4);
});

test("declines the optional power target and still draws for both names", () => {
  const e = OnePieceTestEngine.create(
    {
      hand: ["ST30-016"],
      activeDon: 1,
      character: ["ST30-007", "ST30-012"],
      deck: ["ST02-002", "ST02-012"],
    },
    {},
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().chooseCounter("ST30-016");
  e.asSouth().chooseTargets();
  e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
  expect(e.getView("south").players.south.hand.some((c) => c.cardId === "ST02-002")).toBe(true);
  expect(e.getView("south").players.south.lifeCount).toBe(3);
});

test("both named base6000 cards qualify after current power is reduced", () => {
  const e = OnePieceTestEngine.create(
    {
      hand: ["ST30-016"],
      activeDon: 1,
      character: ["ST30-007", "ST30-012"],
      deck: ["ST02-002", "ST02-012"],
    },
    { character: ["ST30-007"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST30-007"), e.leader("south"));
  e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST30-007"));
  expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  e.asSouth().chooseCounter("ST30-016");
  e.asSouth().chooseTargets(e.leader("south"));
  expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
  expect(e.getView("south").players.south.lifeCount).toBe(4);
});
