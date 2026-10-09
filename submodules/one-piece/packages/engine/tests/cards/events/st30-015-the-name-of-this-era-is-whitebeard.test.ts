import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["leader", "character"])("two base6000 Characters enable the Counter for %s", (kind) => {
  const e = OnePieceTestEngine.create(
    {
      hand: ["ST30-015"],
      activeDon: 1,
      character: [{ cardId: "ST02-006", rested: true }, "ST01-012"],
    },
    { character: [{ cardId: "ST02-013", attachedDon: kind === "leader" ? 1 : 2 }] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  const target =
    kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST02-006");
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), target);
  e.asSouth().chooseCounter("ST30-015");
  e.asSouth().chooseTargets(target);
  expect(e.getView("south").players.south.lifeCount).toBe(4);
  expect(e.getView("south").players.south.leader.power).toBe(5000);
  expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
});

test("one base6000 and one base7000 Character do not enable the Counter", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST30-015"], activeDon: 1, character: ["ST02-006", "ST02-013"] },
    { character: ["ST02-013"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
  e.asSouth().chooseBlocker();
  e.asSouth().chooseCounter("ST30-015");
  expect(e.getView("south").players.south.lifeCount).toBe(3);
  expect(e.getView("south").players.south.trash.some((c) => c.cardId === "ST30-015")).toBe(true);
});

test("declines the optional boost despite both qualifying Characters", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST30-015"], activeDon: 1, character: ["ST02-006", "ST01-012"] },
    { character: ["ST02-013"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
  e.asSouth().chooseCounter("ST30-015");
  e.asSouth().chooseTargets();
  expect(e.getView("south").players.south.lifeCount).toBe(3);
});

test("Life Trigger uses current opposing power and needs no friendly Characters", () => {
  const e = OnePieceTestEngine.create(
    { life: ["ST30-015"] },
    {
      character: [
        { cardId: "ST02-002", attachedDon: 1 },
        { cardId: "ST01-012", attachedDon: 1 },
      ],
    },
    { activeSeat: "north", firstPlayer: "south" },
  );
  const victim = e.findCardInZone("north", "character", "ST02-002");
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().activateLifeTrigger();
  const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
  if (p?.kind !== "selectEntity") throw Error("Expected KO targets");
  expect(p.candidates.map((c) => c.ref.id)).toEqual([victim]);
  e.asSouth().chooseTargets(victim);
  expect(e.getView("north").players.north.trash.some((c) => c.instanceId === victim)).toBe(true);
  expect(e.getView("north").players.north.characters.some((c) => c?.cardId === "ST01-012")).toBe(
    true,
  );
});

test("base6000 still counts after the attack effect reduces current power", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST30-015"], activeDon: 1, character: ["ST02-006", "ST01-012"] },
    { character: ["ST30-007"] },
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.findCardInZone("north", "character", "ST30-007"), e.leader("south"));
  e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST02-006"));
  expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  e.asSouth().chooseCounter("ST30-015");
  e.asSouth().chooseTargets(e.leader("south"));
  expect(e.getView("south").players.south.lifeCount).toBe(4);
});
