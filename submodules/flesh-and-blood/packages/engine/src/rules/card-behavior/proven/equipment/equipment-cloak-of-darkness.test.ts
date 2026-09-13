/**
 * DTD166 Cloak of Darkness — Shadow Chest (no printed defense) + Blood Debt.
 *
 * Printed:
 *   If your hero would be dealt damage, you may banish this to prevent 2 of
 *   that damage.
 *
 * Reasoning (hand-authored, sibling of DTD165 Shroud of Darkness):
 * 1. Prior optionalCost was banish from:arena count 1 — "Banish this" is
 *    banish-self (same residue as shroud/radiant family).
 * 2. Continuous static prevention offers its optional banish-self cost on combat damage.
 * 3. Snatch 4 − prevent 2 = 2; piece goes to banished (not GY).
 * 4. Second hit after banished deals full (one-shot).
 * 5. Blood Debt is keyword-tested elsewhere.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { cloakOfDarkness } from "../../../../../../cards/src/cards/equipment/cloak-of-darkness.ts";

const SNATCH = 4;
const LIFE = 20;

describe("cloak-of-darkness (DTD166)", () => {
  it("core mechanic: banish-self → prevent 2 of combat damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [cloakOfDarkness],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toContain(cloakOfDarkness.canonicalId);

    game.as(dash).attackWith(snatchRed);
    game.advanceToDecision(Bravo, "option");
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.life()).toBe(LIFE - (SNATCH - 2));
    expect(Bravo.zone("chest")).not.toContain(cloakOfDarkness.canonicalId);
    expect(Bravo.zone("banished")).toContain(cloakOfDarkness.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(cloakOfDarkness.canonicalId);
  });

  it("boundaries: after banished, second hit full; model banish-self", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        chest: [cloakOfDarkness],
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
    expect(Bravo.zone("banished")).toContain(cloakOfDarkness.canonicalId);

    expect(Dash.actionPoints()).toBe(1);
    const lifeBeforeSecondHit = Bravo.life();
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(lifeBeforeSecondHit - SNATCH);

    const a1 = cloakOfDarkness.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      optionalCost: { class: "effect", type: "banish-self" },
      duration: "while-in-arena",
    });
    expect(cloakOfDarkness.base.keywords?.some((k) => k.name === "blood-debt")).toBe(true);
  });
});
