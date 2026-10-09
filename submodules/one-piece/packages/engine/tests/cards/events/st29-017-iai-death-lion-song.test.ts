import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["leader", "character"])(
  "Counter protects %s then KOs only cost three or less",
  (kind) => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST29-017"],
        activeDon: 2,
        life: 2,
        character: [{ cardId: "ST02-006", rested: true }],
      },
      { character: ["ST02-013", "ST02-002", "ST02-006"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target =
      kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST02-006");
    const victim = e.findCardInZone("north", "character", "ST02-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), target);
    e.asSouth().chooseCounter("ST29-017");
    e.asSouth().chooseTargets(target);
    const boosted = e.getView("south").players.south;
    expect(kind === "leader" ? boosted.leader.power : boosted.characters[0]?.power).toBe(
      kind === "leader" ? 9000 : 10000,
    );
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("Expected KO target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([victim]);
    e.asSouth().chooseTargets(victim);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === victim)).toBe(true);
  },
);

test("at three Life Counter still protects but does not KO", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-017"], activeDon: 2, life: 3 },
    { character: ["ST02-013", "ST02-002"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
  e.asSouth().chooseCounter("ST29-017");
  e.asSouth().chooseTargets(e.leader("south"));
  expect(e.getView("south").players.south.lifeCount).toBe(3);
  expect(e.getView("north").players.north.trash).toHaveLength(0);
  expect(e.getView("south").prompts).toHaveLength(0);
});

test("declines the optional KO with an eligible Character present", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-017"], activeDon: 2, life: 2 },
    { character: ["ST02-013", "ST02-002"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
  e.asSouth().chooseCounter("ST29-017");
  e.asSouth().chooseTargets(e.leader("south"));
  e.asSouth().chooseTargets();
  expect(e.getView("south").players.south.lifeCount).toBe(2);
  expect(e.getView("north").players.north.trash).toHaveLength(0);
});

test("Life Trigger draws two then trashes one chosen hand card", () => {
  const e = OnePieceTestEngine.create(
    { life: ["ST29-017"], deck: ["ST02-002", "ST02-006", "ST02-012"], hand: ["ST01-011"] },
    {},
    { activeSeat: "north", firstPlayer: "south" },
  );
  const discard = e.findCardInZone("south", "hand", "ST01-011");
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().chooseCounter();
  e.asSouth().activateLifeTrigger();
  e.asSouth().trashFromHand(discard);
  expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
    "ST02-002",
    "ST02-006",
  ]);
  expect(e.getView("south").players.south.trash.some((c) => c.instanceId === discard)).toBe(true);
});

test("declines the initial power boost but still KOs the low-cost attacker", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST29-017"], activeDon: 2, life: 2 },
    { character: ["ST02-002"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  const attacker = e.findCardInZone("north", "character", "ST02-002");
  e.asNorth().attack(attacker, e.leader("south"));
  e.asSouth().chooseCounter("ST29-017");
  e.asSouth().chooseTargets();
  e.asSouth().chooseTargets(attacker);
  expect(e.getView("south").players.south.lifeCount).toBe(2);
  expect(e.getView("south").players.south.leader.power).toBe(5000);
  expect(e.getView("north").players.north.trash.some((c) => c.instanceId === attacker)).toBe(true);
});
