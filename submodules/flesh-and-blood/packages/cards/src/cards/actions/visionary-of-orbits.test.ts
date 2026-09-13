import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cloudCoverYellow } from "../instants/cloud-cover.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { visionaryOfOrbitsRed } from "./visionary-of-orbits.ts";

/**
 * Visionary of Orbits, Red (OMN151) — Lightning Attack, cost 3, 7{p}.
 * Printed: "When this hits, you may put an instant card from your graveyard
 * on the bottom of your deck."
 */

describe("Visionary of Orbits (OMN151) AAA", () => {
  it("happy: a hit may put an instant from graveyard on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [visionaryOfOrbitsRed],
        graveyard: [cloudCoverYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(visionaryOfOrbitsRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(cloudCoverYellow);

    expect(Dash.zone("deck")).toContain(cloudCoverYellow.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(cloudCoverYellow.canonicalId);
  });

  it("boundary: a miss leaves the instant in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [visionaryOfOrbitsRed],
        graveyard: [cloudCoverYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(visionaryOfOrbitsRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cloudCoverYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the optional leaves the instant in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [visionaryOfOrbitsRed],
        graveyard: [cloudCoverYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(visionaryOfOrbitsRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cloudCoverYellow).toBeIn("graveyard");
  });
});
