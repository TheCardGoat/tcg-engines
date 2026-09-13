import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { predatoryAssaultRed } from "../../../../../../cards/src/cards/actions/predatory-assault.ts";
import { unflinchingFoothold } from "../../../../../../cards/src/cards/equipment/unflinching-foothold.ts";

describe("unflinching-foothold (PEN318)", () => {
  it("AAA: destroys itself and removes dominate from a real target attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [unflinchingFoothold],
        hand: [predatoryAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.attackWith(predatoryAssaultRed, { target: game.as(dash).id });
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(unflinchingFoothold);
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(unflinchingFoothold.canonicalId);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("dominate");
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(14);
  });

  it("boundary: an attack without dominate is still a legal target and the free Instant needs no resources", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [unflinchingFoothold],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.attackWith(snatchRed, { target: game.as(dash).id });
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(unflinchingFoothold);
    game.passBoth();
    expect(Bravo.zone("graveyard")).toContain(unflinchingFoothold.canonicalId);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("dominate");
  });
});
