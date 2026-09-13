/**
 * EVO010 Teklovossen, the Mechropotent — demi-hero acceptance.
 *
 * a1: Action — {r}{r}{r}, banish 2 from soul: Attack (attack-with: self).
 * a2: Triggered — Whenever this attacks a hero, they discard a card.
 * a3: Continuous — "Your Mechanologist attack action cards get go again."
 * a4: Continuous — "This counts as having 4 Evos equipped."
 */
import { describe, expect, it } from "vitest";

import { FabTestEngine, buildFabRulesView } from "../../index.ts";
import { dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

import { teklovossenTheMechropotent } from "../../../../cards/src/cards/demi-heroes/teklovossen-the-mechropotent.ts";
import { zeroToSixtyRed } from "../../../../cards/src/cards/actions/zero-to-sixty.ts";

describe("Teklovossen, the Mechropotent (EVO010)", () => {
  it("a3: grants go-again to Mechanologist attack action cards", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [zeroToSixtyRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);

    Teklovossen.attackWith(zeroToSixtyRed);

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("a3 boundary: non-Mechanologist attack action does not get go-again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [snatchRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);

    Teklovossen.attackWith(snatchRed);

    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  it("a1: activates attack ability and remains the hero after combat", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 3,
        soul: 2,
      },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      { autoPassPriority: false },
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);

    expect(Teklovossen.zone("heroZone")).toContain(teklovossenTheMechropotent.canonicalId);

    // Activate the attack-with-self ability
    Teklovossen.activate(teklovossenTheMechropotent);
    game.passBoth(); // activation layer
    game.passBoth(); // combat resolution

    expect(Teklovossen.zone("heroZone")).toContain(teklovossenTheMechropotent.canonicalId);
  });

  it("a2: when attacking a hero, defending hero discards a card", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 3,
        soul: 2,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);
    const Dash = game.as(dash);
    const dashHandBefore = Dash.zone("hand").length;

    Teklovossen.activate(teklovossenTheMechropotent);
    game.passBoth(); // activation layer
    game.helpers.resolveRestOfCombat();

    // a2: "Whenever this attacks a hero, they discard a card."
    expect(Dash.zone("hand").length).toBe(dashHandBefore - 1);
  });

  it("a4: count-as-equipped rule modification is active for Evo subtypes", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    // Build the continuous-rules view and find count-as-equipped rules
    const view = buildFabRulesView(game.getState());
    const evoCountRules = view
      .rules()
      .filter((rule) => rule.action === "count-as-equipped" && rule.mode === "allow");

    // Teklovossen a4 produces one count-as-equipped rule for Evo subtypes
    expect(evoCountRules).toHaveLength(1);
    expect(evoCountRules[0]!.filter?.typeBox?.subtypes).toEqual(["Evo"]);
    expect(evoCountRules[0]!.limit?.count).toBe(4);
  });
});
