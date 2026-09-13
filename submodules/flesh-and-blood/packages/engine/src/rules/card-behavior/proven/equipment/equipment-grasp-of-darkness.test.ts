/**
 * DTD167 Grasp of Darkness — Shadow Arms + Blood Debt.
 *
 * Printed:
 *   If your hero would be dealt damage, you may banish this to prevent 2 of
 *   that damage.
 *   Blood Debt
 *
 * Reasoning (hand-authored; DTD165 Shroud / DTD166 Cloak sibling):
 * 1. Prior optionalCost banish from:arena — wrong for "Banish this".
 *    Remodel: banish-self.
 * 2. Continuous while-in-arena prevention offers its optional banish-self cost.
 * 3. Happy: Snatch 4 − prevent 2 = 2; arms → banished.
 * 4. Boundary: second hit full damage (one-shot).
 * 5. Blood Debt keyword present (end-phase path not re-exercised).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { graspOfDarkness } from "../../../../../../cards/src/cards/equipment/grasp-of-darkness.ts";

const SNATCH = 4;
const LIFE = 20;

describe("grasp-of-darkness (DTD167)", () => {
  it("core mechanic: banish-self → prevent 2 of combat damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [graspOfDarkness],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arms")).toContain(graspOfDarkness.canonicalId);

    game.as(dash).attackWith(snatchRed);
    game.advanceToDecision(Bravo, "option");
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.life()).toBe(LIFE - (SNATCH - 2));
    expect(Bravo.zone("arms")).not.toContain(graspOfDarkness.canonicalId);
    expect(Bravo.zone("banished")).toContain(graspOfDarkness.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(graspOfDarkness.canonicalId);
  });

  it("boundaries: second hit full; model banish-self prevent; Blood Debt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        arms: [graspOfDarkness],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.advanceToDecision(Bravo, "option");
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(LIFE - (SNATCH - 2));
    expect(Bravo.zone("banished")).toContain(graspOfDarkness.canonicalId);

    // Advance to Dash's next turn through public turn transitions.
    Dash.endTurn();
    Bravo.endTurn();
    expect(Dash.actionPoints()).toBe(1);
    const lifeBeforeSecondHit = Bravo.life();
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(lifeBeforeSecondHit - SNATCH);

    const a1 = graspOfDarkness.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.staticKind).toBe("continuous");
      expect(a1.effect).toMatchObject({
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        optionalCost: { type: "banish-self" },
        duration: "while-in-arena",
      });
      expect(a1.effect).not.toMatchObject({
        optionalCost: { type: "banish", from: "arena" },
      });
    }
    expect(graspOfDarkness.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blood-debt" })]),
    );
  });
});
