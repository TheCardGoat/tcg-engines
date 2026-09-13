import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { scaldingRainYellow } from "../../../../../../cards/src/cards/actions/scalding-rain.ts";
import { stormStriders } from "../../../../../../cards/src/cards/equipment/storm-striders.ts";

describe("storm-striders (ARC116)", () => {
  it("AAA: destroys itself and grants the next Wizard non-attack action as an Instant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, legs: [stormStriders], hand: [scaldingRainYellow], resourcePoints: 2, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed, { target: Dash.id });
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.activate(stormStriders);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Dash.zone("graveyard")).toContain(stormStriders.canonicalId);
    expect(Dash.resourcePoints()).toBe(1);
    game.helpers.passPriorityTo(Dash);
    Dash.play(scaldingRainYellow, { target: Bravo.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.life()).toBe(17);
    expect(Dash.zone("graveyard")).toContain(scaldingRainYellow.canonicalId);
    expect(Dash.zone("hand")).not.toContain(scaldingRainYellow.canonicalId);
  });

  it("boundary: zero resources cannot activate Storm Striders", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [stormStriders], hand: [scaldingRainYellow], resourcePoints: 0, deck: 4 },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(() => {
      Dash.activate(stormStriders);
      game.helpers.resolveUntilIdle({ optionalBoolean: true });
    }).toThrow();
    expect(Dash.zone("legs")).toContain(stormStriders.canonicalId);
    expect(Dash.zone("hand")).toContain(scaldingRainYellow.canonicalId);
  });
});
