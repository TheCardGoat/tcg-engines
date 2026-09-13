import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { evoSentryBaseHeadRed } from "./evo-sentry-base-head.ts";
import { evoSentryBaseChestRed } from "./evo-sentry-base-chest.ts";
import { evoSentryBaseArmsRed } from "./evo-sentry-base-arms.ts";
import { evoSentryBaseLegsRed } from "./evo-sentry-base-legs.ts";
import { annihilatorEngineRed } from "./annihilator-engine.ts";

describe("Annihilator Engine (EVO054) AAA", () => {
  it("happy: four Evos make this 9{p} with overpower and destroy defending cards on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoSentryBaseHeadRed],
        chest: [evoSentryBaseChestRed],
        arms: [evoSentryBaseArmsRed],
        legs: [evoSentryBaseLegsRed],
        hand: [annihilatorEngineRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);
    Teklo.playAttack(annihilatorEngineRed);
    expectCombat(game).toHaveAttackPower(9).toHaveKeyword("overpower");
    Dash.defendWith(nimblismBlue);
    game.closeCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(33);
  });

  it("boundary: with no Evos this stays 6{p} and costs 6", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [annihilatorEngineRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).playAttack(annihilatorEngineRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: one Evo still costs 6 but the hit destroys defending cards", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoSentryBaseHeadRed],
        hand: [annihilatorEngineRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(teklovossen).playAttack(annihilatorEngineRed);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith(nimblismBlue);
    game.closeCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });
});
