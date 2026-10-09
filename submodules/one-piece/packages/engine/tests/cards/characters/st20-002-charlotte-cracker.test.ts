import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
function ko(e: OnePieceTestEngine, id: string) {
  e.asSouth().play("OP04-038");
  e.asSouth().chooseTargets();
  e.asSouth().chooseTargets(id);
}
describe("ST20-002 Cracker", () => {
  test("opposing effect KO replaces once with top Life and second KO succeeds", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      { character: [{ cardId: "ST20-002", rested: true }], life: ["ST02-002", "ST02-012"] },
    );
    const c = e.findCardInZone("north", "character", "ST20-002");
    ko(e, c);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(c);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toEqual(["ST02-002"]);
    ko(e, c);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(c);
    expect(e.getView("north").players.north.lifeCount).toBe(1);
  });
  test("own effect KO can be replaced", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST04-001",
      hand: ["OP01-094"],
      activeDon: 10,
      character: ["ST20-002"],
      life: 2,
    });
    const c = e.findCardInZone("south", "character", "ST20-002");
    e.asSouth().play("OP01-094");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(c);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
  });
  test("declines optional replacement and keeps Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "ST20-002", rested: true }], life: 2 },
    );
    const c = e.findCardInZone("north", "character", "ST20-002");
    ko(e, c);
    e.resolveDecision("effectKoReplacement", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(c);
  });
  test("zero Life cannot replace effect KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "ST20-002", rested: true }], life: 0 },
    );
    const c = e.findCardInZone("north", "character", "ST20-002");
    ko(e, c);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(c);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("battle KO cannot replace with Life", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST20-002", rested: true }], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST20-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), c);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(c);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
  test("Life Trigger discards then plays the physical card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST20-002"], hand: ["ST02-002"] },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const c = e.findCardInZone("south", "life", "ST20-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.asSouth().activateLifeTrigger();
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(c);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
  test("declines optional Life Trigger discard", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST20-002"], hand: ["ST02-002"] },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.asSouth().activateLifeTrigger();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
  test("replacement resets next turn for the same physical Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      {
        character: [{ cardId: "ST20-002", rested: true, playedOnTurn: 0 }],
        life: ["ST02-002", "ST02-012"],
      },
    );
    const c = e.findCardInZone("north", "character", "ST20-002");
    ko(e, c);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.asSouth().endTurn();
    e.asNorth().attack(c, e.leader("south"));
    e.asSouth().chooseCounter();
    e.asNorth().endTurn();
    ko(e, c);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(c);
    expect(e.getView("north").players.north.lifeCount).toBe(0);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toEqual([
      "ST02-002",
      "ST02-012",
    ]);
  });
});
