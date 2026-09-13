import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, upOnAPedestalBlue } from "../../../fixtures.ts";
import { fluttersteps } from "../../../../../../cards/src/cards/equipment/fluttersteps.ts";

describe("fluttersteps (ROS251)", () => {
  it("AAA: Ward destruction grants a next-Aura permission, then a real Aura is played as an Instant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, legs: [fluttersteps], hand: [upOnAPedestalBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Dash.zone("graveyard")).toContain(fluttersteps.canonicalId);
    game.helpers.passPriorityTo(Dash);
    Dash.play(upOnAPedestalBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Dash.zone("arena")).toContain(upOnAPedestalBlue.canonicalId);
    expect(Dash.zone("hand")).not.toContain(upOnAPedestalBlue.canonicalId);
  });

  it("boundary: Ward can destroy the legs without inventing an Aura play when hand is empty", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 4 },
      { hero: dash, legs: [fluttersteps], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("graveyard")).toContain(fluttersteps.canonicalId);
  });
});
