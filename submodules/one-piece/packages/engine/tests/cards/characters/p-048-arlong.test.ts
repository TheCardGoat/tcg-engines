import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-048 Arlong", () => {
  test.each([
    [1, 4],
    [0, 4],
    [1, 3],
  ])("attack with %i DON and %i Life", (don, life) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        character: ["P-048"],
        activeDon: 1,
        life: Array.from({ length: life }, () => "ST02-002"),
      },
      { leaderCardId: "ST01-001", hand: ["ST02-002", "ST02-006"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const a = e.findCardInZone("south", "character", "P-048"),
      chosen = e.findCardInZone("north", "hand", "ST02-002");
    if (don) e.asSouth().attachDon(a, don);
    e.asSouth().attack(a, e.leader("north"));
    if (don === 1 && life === 4) {
      const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
      if (p?.kind !== "selectEntity") throw Error("hand choice");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toContain(chosen);
      e.asNorth().chooseTargets(chosen);
      expect(e.getState().players.north.deck.at(-1)).toBe(chosen);
      expect(e.getView("north").players.north.handCount).toBe(1);
    } else expect(e.getView("north").players.north.handCount).toBe(2);
  });
  test("empty opposing hand still resolves the attack", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["P-048"],
        activeDon: 1,
        life: ["ST02-002", "ST02-002", "ST02-002", "ST02-002"],
      },
      { leaderCardId: "ST01-001", life: ["ST02-002", "ST02-006"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const a = e.findCardInZone("south", "character", "P-048");
    e.asSouth().attachDon(a, 1);
    e.asSouth().attack(a, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(1);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
