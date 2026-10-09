import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/index.ts";

const observerText =
  '[Once Per Turn] When your Leader with a type including "Rocks Pirates" attacks or is attacked, you may trash 1 card from your hand to activate this effect. Your Leader gains +3000 power during this battle.';

describe("Leader attack observers", () => {
  test("OP17-040 keeps On Play and both optional paid observer branches", () => {
    const result = buildCardEffects(`[On Play] Draw 1 card.\n${observerText}`);
    expect(result?.effects).toHaveLength(3);
    expect(result?.effects?.[0]).toEqual({
      trigger: "onPlay",
      actions: [{ action: "draw", player: "self", amount: 1 }],
    });
    const branches = result!.effects!.slice(1);
    expect(branches.map((effect) => effect.trigger)).toEqual(["onYourAttack", "onOpponentAttack"]);
    expect(branches[0]?.eventFilter).toEqual({
      filters: [{ filter: "cardCategory", value: "leader" }],
    });
    expect(branches[1]?.eventFilter).toEqual({
      targetFilters: [{ filter: "cardCategory", value: "leader" }],
    });
    for (const effect of branches) {
      expect(effect.conditions).toEqual([
        { condition: "leaderTrait", trait: "Rocks Pirates", match: "includes" },
      ]);
      expect(effect.costs).toEqual([{ cost: "trashFromHand", amount: 1 }]);
      expect(effect.optional).toBe(true);
      expect(effect.oncePerTurn).toBe(true);
      expect(effect.actions).toEqual([
        {
          action: "modifyPower",
          target: { player: "self", zones: ["leader"], count: { amount: 1 } },
          value: 3000,
          duration: "thisBattle",
        },
      ]);
    }
    expect(branches[0]?.oncePerTurnKey).toBeTruthy();
    expect(branches[1]?.oncePerTurnKey).toBe(branches[0]?.oncePerTurnKey);
    expect(result?.permanentEffects).toBeUndefined();
  });

  test.each(["your {Straw Hat Crew} type Leader", "your Leader with the {Straw Hat Crew} type"])(
    "preserves the named trait and cost for %s",
    (leader) => {
      const result = buildCardEffects(
        `When ${leader} attacks or is attacked, you may trash 2 cards from your hand to activate this effect. Your Leader gains +2000 power during this battle.`,
      );
      expect(result?.effects).toHaveLength(2);
      for (const effect of result!.effects!) {
        expect(effect.conditions).toEqual([
          { condition: "leaderTrait", trait: "Straw Hat Crew", match: "exact" },
        ]);
        expect(effect.costs).toEqual([{ cost: "trashFromHand", amount: 2 }]);
        expect(effect.oncePerTurn).toBeUndefined();
        expect(effect.oncePerTurnKey).toBeUndefined();
      }
    },
  );

  test("the existing this-Leader form remains source-bound", () => {
    const result = buildCardEffects(
      "When this Leader attacks or is attacked, this Leader gains +1000 power during this battle.",
    );
    expect(result?.effects?.map((effect) => effect.trigger)).toEqual([
      "whenAttacking",
      "onOpponentAttack",
    ]);
    expect(result?.effects?.[1]?.eventFilter).toEqual({ targetSelf: true });
    expect(result?.effects?.[0]?.conditions).toBeUndefined();
    expect(result?.effects?.[0]?.actions[0]).toMatchObject({
      action: "modifyPower",
      value: 1000,
      duration: "thisBattle",
    });
  });
});
