/**
 * EVR053 Helm of Sharp Eye — Battleworn d1. Play-from-banished this combat
 * chain lives in packages/cards/src/cards/equipment/helm-of-sharp-eye.test.ts.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { helmOfSharpEye } from "../../../../../../cards/src/cards/equipment/helm-of-sharp-eye.ts";

const LIFE = 20;

describe("helm-of-sharp-eye (EVR053)", () => {
  it("proven: battleworn d1 — defend keeps seat at d0", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        head: [helmOfSharpEye],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(dash).attackWith(snatchRed);
    game.as(bravo).defendWith(helmOfSharpEye);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).zone("head")).toContain(helmOfSharpEye.canonicalId);
    // snatch 4 − d1 = 3 damage.
    expect(game.as(bravo).life()).toBe(LIFE - 3);
  });
});
