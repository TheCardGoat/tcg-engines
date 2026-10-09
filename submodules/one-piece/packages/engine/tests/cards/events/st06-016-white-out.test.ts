import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-016 White Out", () => {
  test("Counter buffs the Leader by2000 for the battle", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { hand: ["ST06-016"], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const event = e.findCardInZone("north", "hand", "ST06-016");
    const life = e.getView("north").players.north.lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(life);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
  test("Trigger draws and protects existing Characters but not a later Life-trigger play", () => {
    const e = OnePieceTestEngine.create(
      {
        character: Array.from({ length: 4 }, () => ({ cardId: "ST02-006", playedOnTurn: 0 })),
        hand: ["ST01-015"],
        activeDon: 4,
      },
      {
        life: ["ST06-016", "ST07-007"],
        character: [{ cardId: "ST02-002", rested: true }],
        deck: ["ST02-006", "ST02-006", "ST02-006", "ST02-006"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackers = e
      .getView("south")
      .players.south.characters.filter((c) => c !== null)
      .map((c) => c.instanceId);
    const protectedId = e.findCardInZone("north", "character", "ST02-002");
    e.declareAttack(attackers[0]!, e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
    e.playCard("ST01-015", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");
    expect(
      e.getView("north").players.north.characters.some((c) => c?.instanceId === protectedId),
    ).toBe(true);
    e.declareAttack(attackers[1]!, protectedId, "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(
      e.getView("north").players.north.characters.some((c) => c?.instanceId === protectedId),
    ).toBe(true);
    e.declareAttack(attackers[2]!, e.leader("north"), "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const newId = e.findCardInZone("north", "character", "ST07-007");
    e.declareAttack(attackers[3]!, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [newId] }, "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(newId);
    expect(
      e.getView("north").players.north.characters.some((c) => c?.instanceId === protectedId),
    ).toBe(true);
    e.endTurn("south");
    e.declareAttack(protectedId, e.leader("south"), "north");
    e.endTurn("north");
    e.declareAttack(attackers[0]!, protectedId, "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(protectedId);
  });
});
