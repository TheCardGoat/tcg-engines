import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OP17-020 Shanks alternative activation cost", () => {
  test.each([0, 1])("chooses cost branch %i and consumes one use", (branch) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-020", hand: ["EB01-005", "EB01-025"], activeDon: 1 },
      { character: [{ cardId: "OP17-045", rested: true }] },
    );
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAlternativeCost", { optionId: String(branch) }, "south");
    if (branch === 0)
      e.resolveDecision(
        "effectCostTrashFromHand",
        { selectedIds: [e.findCardInZone("south", "hand", "EB01-025")] },
        "south",
      );
    e.asSouth().chooseTargets("OP17-045");
    const v = e.getView("south");
    expect(v.players.south.hand).toHaveLength(branch === 0 ? 1 : 2);
    expect(v.players.south.activeDon).toBe(branch === 0 ? 1 : 0);
    expect(() => e.asSouth().activateMain(e.leader("south"))).toThrow();
    e.asSouth().endTurn();
    expect(
      e.getView("north").players.north.characters.find((c) => c?.cardId === "OP17-045")?.rested,
    ).toBe(true);
  });
  test.each([0, 1])("can pay sole affordable branch %i", (branch) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-020",
        hand: branch === 0 ? ["EB01-005"] : [],
        activeDon: branch === 0 ? 0 : 1,
      },
      { character: [{ cardId: "OP17-045", rested: true }] },
    );
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets("OP17-045");
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("cannot activate with neither cost available", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "OP17-020", hand: [], activeDon: 0 }, {});
    expect(() => e.asSouth().activateMain(e.leader("south"))).toThrow();
  });
  test("decline preserves costs and the once-per-turn use", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "OP17-020", hand: [], activeDon: 1 }, {});
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(1);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
