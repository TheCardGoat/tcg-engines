import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-017 Fire Fist", () => {
  test.each(["south", "north"] as const)(
    "reveal cards stay in hand, draws then bottoms %s cost-five Character",
    (owner) => {
      const e = OnePieceTestEngine.create(
        {
          hand: ["ST22-017", "OP01-033", "ST15-001", "ST02-002"],
          activeDon: 5,
          character: ["ST22-010"],
          deck: ["ST02-006", "ST02-012"],
        },
        { character: ["ST22-010", "ST22-003"] },
      );
      const target = e.findCardInZone(owner, "character", "ST22-010"),
        a = e.findCardInZone("south", "hand", "OP01-033"),
        b = e.findCardInZone("south", "hand", "ST15-001");
      e.asSouth().play("ST22-017");
      e.asSouth().acceptOptional();
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
        expect.arrayContaining([a, b]),
      );
      expect(e.getView("south").players.south.handCount).toBe(4);
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("target");
      expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("north", "character", "ST22-003"),
      );
      e.asSouth().chooseTargets(target);
      expect(e.getState().players[owner].deck.at(-1)).toBe(target);
    },
  );
  test("declines optional reveal without draw or removal", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST22-017", "OP01-033", "ST15-001"], activeDon: 5, deck: 10 },
      { character: ["ST22-010"] },
    );
    e.asSouth().play("ST22-017");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test("may choose zero removal after reveal and draw", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST22-017", "OP01-033", "ST15-001"], activeDon: 5, deck: 10 },
      { character: ["ST22-010"] },
    );
    e.asSouth().play("ST22-017");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.handCount).toBe(3);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test.each(["south", "north"] as const)(
    "Life Trigger bounces %s cost-three without reveal payment",
    (owner) => {
      const e = OnePieceTestEngine.create(
        { life: ["ST22-017"], character: ["ST02-012"] },
        { character: [{ cardId: "ST02-006", playedOnTurn: 0 }, "ST02-012"] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const target = e.findCardInZone(owner, "character", "ST02-012");
      e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("bounce");
      expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("north", "character", "ST02-006"),
      );
      e.asSouth().chooseTargets(target);
      expect(e.getView(owner).players[owner].hand.map((c) => c.instanceId)).toContain(target);
    },
  );
});
