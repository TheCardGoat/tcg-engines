import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST20-004 Pudding", () => {
  test("pays top Life then readies only a cost-three-or-less Big Mom Character", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST20-004"],
      activeDon: 3,
      life: ["ST02-002", "ST02-012"],
      character: [
        { cardId: "ST07-008", rested: true },
        { cardId: "ST20-002", rested: true },
        { cardId: "ST02-012", rested: true },
      ],
    });
    const target = e.findCardInZone("south", "character", "ST07-008");
    e.asSouth().play("ST20-004");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("ready target");
    const legal = step.candidates.filter((c) => c.legal).map((c) => c.ref.id);
    expect(legal).toContain(target);
    expect(legal).not.toContain(e.findCardInZone("south", "character", "ST20-002"));
    expect(legal).not.toContain(e.findCardInZone("south", "character", "ST02-012"));
    e.asSouth().chooseTargets(target);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
  });
  test("declines optional Life payment without readying", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST20-004"],
      activeDon: 3,
      life: 2,
      character: [{ cardId: "ST07-008", rested: true }],
    });
    e.asSouth().play("ST20-004");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("Luffy replacement bottoms face-up Life and prevents paid effect", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      hand: ["ST20-004"],
      activeDon: 3,
      life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }],
      character: [{ cardId: "ST07-008", rested: true }],
    });
    const paid = e.findCardInZone("south", "life", "ST02-002");
    e.asSouth().play("ST20-004");
    e.asSouth().acceptOptional();
    expect(e.getState().players.south.deck.at(-1)).toBe(paid);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger rests only opposing cost-three-or-less Character", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST20-004"] },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }, "ST02-012"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target = e.findCardInZone("north", "character", "ST02-012"),
      high = e.findCardInZone("north", "character", "ST02-006");
    e.asNorth().attack(high, e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("rest target");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
  });
});
