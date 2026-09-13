/**
 * MON240 Time Skippers — Generic Legs d0.
 * Printed: Action - {r}{r}{r}, destroy this: Gain 2 action points.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { timeSkippers } from "../../../../../../cards/src/cards/equipment/time-skippers.ts";

const LIFE = 20;

describe("time-skippers (MON240)", () => {
  it("core: Action 3{r}+destroy → gain 2 AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [timeSkippers], resourcePoints: 3, actionPoints: 1, hand: [], deck: 6 },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.resourcePoints()).toBe(3);

    // Activate: 3{r} + destroy → gain 2 AP.
    Bravo.activate(timeSkippers);
    // Resolve the stack.
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

    // Legs destroyed → GY.
    expect(Bravo.zone("legs")).not.toContain(timeSkippers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(timeSkippers.canonicalId);
    // 1 AP (Action costs 1) - 1 + 2 gained = 2 AP; 3 RP spent.
    expect(Bravo.actionPoints()).toBe(2);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundary: insufficient RP (2{r} < 3{r}) → illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [timeSkippers], resourcePoints: 2, actionPoints: 1, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(timeSkippers)).toThrow();
    expect(game.as(bravo).zone("legs")).toContain(timeSkippers.canonicalId);
  });
});
