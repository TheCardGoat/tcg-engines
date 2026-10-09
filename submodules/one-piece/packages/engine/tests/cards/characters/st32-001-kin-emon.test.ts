import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST32-001 Kin'emon", () => {
  test.each([0, 1])("pays alternative %i, draws two and chooses one discard", (branch) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP01-002",
      hand: ["ST32-001"],
      activeDon: 2,
      deck: ["ST02-002", "ST02-006", "ST02-012"],
    });
    const discard = e.findCardInZone("south", "deck", "ST02-006");
    e.asSouth().play("ST32-001");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAlternativeCost", { optionId: String(branch) }, "south");
    expect(e.getView("south").players.south.handCount).toBe(2);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discard] }, "south");
    const v = e.getView("south").players.south;
    expect(v.leader.rested).toBe(branch === 0);
    expect(v.activeDon).toBe(branch === 0 ? 1 : 0);
    expect(v.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(v.trash.map((c) => c.instanceId)).toContain(discard);
  });
  test("a non-Slash Leader can pay the DON branch", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["ST32-001"],
      activeDon: 2,
      deck: ["ST02-002", "ST02-006", "ST02-012"],
    });
    e.asSouth().play("ST32-001");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [e.findCardInZone("south", "hand", "ST02-006")] },
      "south",
    );
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.leader.rested).toBe(false);
  });
  test("declines with both costs available", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP01-002",
      hand: ["ST32-001"],
      activeDon: 2,
    });
    e.asSouth().play("ST32-001");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.leader.rested).toBe(false);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
  test("no active DON and non-Slash Leader cannot pay", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["ST32-001"],
      activeDon: 1,
    });
    e.asSouth().play("ST32-001");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
});
