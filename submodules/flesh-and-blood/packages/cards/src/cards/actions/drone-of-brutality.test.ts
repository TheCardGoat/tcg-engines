import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { pummelBlue } from "../attack-reactions/pummel.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { droneOfBrutalityRed } from "./drone-of-brutality.ts";

describe("Drone of Brutality (RNR015) AAA", () => {
  it("happy: after combat it goes to the bottom of the deck instead of the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [droneOfBrutalityRed],
        resourcePoints: 2,
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
      },
      { hero: bravoShowstopper, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(droneOfBrutalityRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravoShowstopper)).toHaveLife(14);
    expect(Dash.zone("graveyard")).not.toContain(droneOfBrutalityRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(droneOfBrutalityRed.canonicalId);
  });

  it("boundary: discarded from hand also goes to the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [pummelBlue, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [droneOfBrutalityRed],
        life: 20,
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
      },
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelBlue, {
      modeIds: [`${pummelBlue.canonicalId}:chooseMode:hitHero`],
    });
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expect(Dash.zone("graveyard")).not.toContain(droneOfBrutalityRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(droneOfBrutalityRed.canonicalId);
  });

  it("timing: destroyed from arsenal goes to the bottom of the deck", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [commandAndConquerRed], resourcePoints: 2, deck: 6 },
      {
        hero: dash,
        hand: [],
        arsenal: [droneOfBrutalityRed],
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
      },
    );
    const Dash = game.as(dash);

    game.as(bravoShowstopper).playAttack(commandAndConquerRed);
    game.advanceUntil({
      stopAt: "idle",
      optionals: "decline",
      entityTargets: "minimum",
      ordering: "listed",
    });

    expect(Dash.zone("graveyard")).not.toContain(droneOfBrutalityRed.canonicalId);
    expect(Dash.zone("deck")[0]).toBe(droneOfBrutalityRed.canonicalId);
  });
});
