import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crownOfDominion } from "../equipment/crown-of-dominion.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { nimblismBlue } from "./nimblism.ts";
import { batterToAPulpRed } from "./batter-to-a-pulp.ts";

describe("Batter to a Pulp (LGS387) AAA", () => {
  it("happy: unblocked 10 damage crush-destroys equipment with no defense", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [batterToAPulpRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, head: [crownOfDominion], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(batterToAPulpRed);
    expectCombat(game).toHaveAttackPower(10);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(30);
    expectFabCard(Dash, crownOfDominion).toBeIn("graveyard");
  });

  it("boundary: blocked below 4 damage does not crush", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [batterToAPulpRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 40,
        head: [crownOfDominion],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(batterToAPulpRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(38);
    expectFabCard(Dash, crownOfDominion).toBeIn("head");
  });

  it("timing: 4+ damage on this chain link cannot be prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [batterToAPulpRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 40,
        arena: [spectralShield],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(batterToAPulpRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(30);
    expectFabToken(game, "spectral-shield").toHaveCount(0);
  });
});
