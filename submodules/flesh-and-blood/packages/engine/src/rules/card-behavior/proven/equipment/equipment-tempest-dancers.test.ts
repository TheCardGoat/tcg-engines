import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { tempestDancers } from "../../../../../../cards/src/cards/equipment/tempest-dancers.ts";

describe("tempest-dancers (PEN106)", () => {
  it("AAA: leave-arena trigger plays a real non-attack action as an Instant", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, legs: [tempestDancers], hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed, { target: Dash.id });
    Dash.defendWith(tempestDancers);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.helpers.passPriorityTo(Dash);
    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Dash.zone("graveyard")).toContain(tempestDancers.canonicalId);
    expect(Dash.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("hand")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundary: with no non-attack card in hand, leaving the arena does not invent a play", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 4 },
      { hero: dash, legs: [tempestDancers], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed, { target: Dash.id });
    Dash.defendWith(tempestDancers);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Dash.zone("graveyard")).toContain(tempestDancers.canonicalId);
  });
});
