import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { pummelBlue } from "../attack-reactions/pummel.ts";
import { goliathGauntlet } from "../equipment/goliath-gauntlet.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { thumpRed } from "./thump.ts";

describe("Thump (ELE209) AAA", () => {
  it("happy: +p grants dominate and the on-hit discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [thumpRed, pummelBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.playAttack(thumpRed);
    Dash.defendWith(brutalAssaultBlue);
    game.toReaction("attacker");
    Bravo.must.playReaction(pummelBlue, {
      modeIds: [`${pummelBlue.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("dominate");

    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("hand")).toHaveLength(0);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: at base {p} it does not have dominate and a hit does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [thumpRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.playAttack(thumpRed);
    Dash.defendWith();
    expectCombat(game).toHaveAttackPower(6).notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: +p dominate rejects a two-card hand defense", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        arms: [goliathGauntlet],
        hand: [thumpRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.activate(goliathGauntlet);
    game.passBoth();
    Bravo.playAttack(thumpRed);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(8).toHaveKeyword("dominate");
    expect(Dash.expectBlockRejected([brutalAssaultBlue, nimblismBlue]).errorCode).toBe("dominate");
  });
});
