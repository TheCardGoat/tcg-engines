import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["leader", "character"])(
  "Counter protects %s and lowers an opposing card until turn end",
  (kind) => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST29-015"],
        activeDon: 1,
        life: 1,
        character: [{ cardId: "ST02-006", rested: true }],
      },
      { character: ["ST02-006"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target =
      kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST02-006");
    const reduced =
      kind === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "ST02-006");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), target);
    e.asSouth().chooseCounter("ST29-015");
    e.asSouth().chooseTargets(target);
    const boosted = e.getView("south").players.south;
    expect(kind === "leader" ? boosted.leader.power : boosted.characters[0]?.power).toBe(
      kind === "leader" ? 7000 : 8000,
    );
    e.asSouth().chooseTargets(reduced);
    const view = e.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters[0]?.power).toBe(6000);
    expect(
      kind === "leader" ? view.players.north.leader.power : view.players.north.characters[0]?.power,
    ).toBe(kind === "leader" ? 3000 : 4000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.north.leader.power).toBe(5000);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(6000);
  },
);

test("two Life suppresses only the opposing power loss", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-015"], activeDon: 1, life: 2 },
    { character: ["ST02-006"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
  e.asSouth().chooseCounter("ST29-015");
  e.asSouth().chooseTargets(e.leader("south"));
  expect(e.getView("south").players.south.lifeCount).toBe(2);
  expect(e.getView("south").players.north.characters[0]?.power).toBe(6000);
  expect(e.getView("south").prompts).toHaveLength(0);
});

test("declines the optional Counter boost but still lowers the attacker", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-015"], activeDon: 1, life: 1 },
    { character: ["ST02-006"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  const attacker = e.findCardInZone("north", "character", "ST02-006");
  e.asNorth().attack(attacker, e.leader("south"));
  e.asSouth().chooseCounter("ST29-015");
  e.asSouth().chooseTargets();
  e.asSouth().chooseTargets(attacker);
  expect(e.getView("south").players.south.lifeCount).toBe(1);
  expect(e.getView("south").players.north.characters[0]?.power).toBe(4000);
});

test("Life Trigger draws one without the Counter Life condition", () => {
  const e = OnePieceTestEngine.create(
    { life: ["ST29-015", "ST02-002", "ST02-012"], deck: ["ST02-006", "ST02-002"] },
    {},
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().activateLifeTrigger();
  expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
  expect(e.getView("south").players.north.leader.power).toBe(5000);
});
