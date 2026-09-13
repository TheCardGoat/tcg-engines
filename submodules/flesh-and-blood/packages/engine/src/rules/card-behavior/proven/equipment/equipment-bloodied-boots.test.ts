/**
 * SMP017 Bloodied Boots — Event Legs d0.
 * Printed: You may equip this. Action - Destroy this: Gain 2 action points.
 * The "equip" continuous is the Event-deck equip text (not a separate ability
 * to test — same as SMP014/015/016). The gain-2-AP action is the printed ability.
 * Mirrors proven MON240 time-skippers (same model).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { bloodiedBoots } from "../../../../../../cards/src/cards/equipment/bloodied-boots.ts";

const LIFE = 20;

describe("bloodied-boots (SMP017)", () => {
  it("core: Action destroy → gain 2 AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [bloodiedBoots], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.actionPoints()).toBe(1);

    Bravo.activate(bloodiedBoots);
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d && game.answerForcedDecision()) continue;
      if (d) break;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }
    expect(Bravo.zone("legs")).not.toContain(bloodiedBoots.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodiedBoots.canonicalId);
    // 1 AP (Action costs 1) - 1 + 2 = 2 AP.
    expect(Bravo.actionPoints()).toBe(2);
  });

  it("boundary: 0 AP → illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [bloodiedBoots], actionPoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(bloodiedBoots)).toThrow();
  });
});
