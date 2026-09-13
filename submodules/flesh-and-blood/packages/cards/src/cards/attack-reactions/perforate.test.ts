import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { briar } from "../shared/test-recipients.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { snatchRed } from "../actions/snatch.ts";
import { perforateYellow } from "./perforate.ts";

describe("Perforate (HNT197) AAA", () => {
  it("happy: extra dagger activation this turn at {r} less, plus the draw", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [perforateYellow],
        weapon1: [nerveScalpel],
        resourcePoints: 4,
        actionPoints: 2,
        deckTop: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activateAttack(nerveScalpel); // once-per-turn swing #1: {r}{r}
    game.toReaction("attacker");
    Fang.play(perforateYellow);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
    });
    expectFabPlayer(Fang).toHaveHandCount(1); // a2 draw replaced the reaction
    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1 (swing #1 through unblocked)

    // Swing #2: the additional activation, discounted {r}{r} - 1 = {r}.
    Fang.activateAttack(nerveScalpel);
    expectCombat(game).toHaveAttackPower(1);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(18); // 19 - 1
    expectFabPlayer(Fang).toHaveResourceCount(0); // 4 - 2 - 1 - 1
  });

  it("boundary: declining the optional keeps the dagger at its printed activation limit", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [perforateYellow],
        weapon1: [nerveScalpel],
        resourcePoints: 5,
        actionPoints: 1,
        deckTop: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activateAttack(nerveScalpel);
    game.toReaction("attacker");
    Fang.play(perforateYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Fang).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveLife(19);
    Fang.expectActivationRejected(nerveScalpel);
    expectFabCard(Fang, perforateYellow).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveResourceCount(2);
  });

  it("timing: the independent draw still resolves with no dagger to grant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [snatchRed, perforateYellow],
        resourcePoints: 1,
        deck: [brutalAssaultBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Briar.play(perforateYellow);
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      optionalBoolean: false,
    });

    expectFabCard(Briar, brutalAssaultBlue).toBeIn("hand");
    expectFabCard(Briar, perforateYellow).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveHandCount(1);
  });
});
