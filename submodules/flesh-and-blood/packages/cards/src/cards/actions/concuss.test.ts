import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { betsy } from "../heroes/betsy.ts";
import { pummelBlue } from "../attack-reactions/pummel.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { concussRed } from "./concuss.ts";

describe("Concuss family AAA", () => {
  it("happy: +p then hit discards their remaining hand cards", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [concussRed, pummelBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.playAttack(concussRed);
    Dash.defendWith(nimblismBlue);
    game.toReaction("attacker");
    Betsy.must.playReaction(pummelBlue, {
      modeIds: [`${pummelBlue.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(8);

    game.closeCombat({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("boundary: a hit at base {p} does not discard", () => {
    const game = FabTestEngine.start(
      { hero: betsy, hand: [concussRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.playAttack(concussRed);
    Dash.defendWith();
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: a fully blocked +p attack does not discard the leftover card", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [concussRed, pummelBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.playAttack(concussRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.toReaction("attacker");
    Betsy.must.playReaction(pummelBlue, {
      modeIds: [`${pummelBlue.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
