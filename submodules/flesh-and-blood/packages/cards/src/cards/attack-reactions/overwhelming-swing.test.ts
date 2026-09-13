import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { overwhelmingSwingYellow } from "./overwhelming-swing.ts";

/**
 * Overwhelming Swing (MPW024) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "This costs an additional {r} to play for each card defending on
 * the active chain link. Target weapon attack gets +X{p}, where X is twice
 * the number of cards defending it plus 1."
 */

describe("Overwhelming Swing (MPW024) AAA", () => {
  it("happy: one defending card gives the weapon attack +3{p} and costs {r} extra", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [overwhelmingSwingYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.must.defend(nimblismBlue);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(overwhelmingSwingYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Kassai).toHaveResourceCount(0);
    expectFabCard(Kassai, overwhelmingSwingYellow).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a weapon attack (silent no-op)", () => {
    // Printed "Target weapon attack" — Snatch is not a weapon. Current engine
    // accepts playReaction and leaves the card in hand with no +X{p}.
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [overwhelmingSwingYellow, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.must.playReaction(overwhelmingSwingYellow));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, overwhelmingSwingYellow).toBeIn("hand");
  });

  it("timing: with no defending cards this costs 0 extra and the weapon gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [overwhelmingSwingYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(overwhelmingSwingYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Kassai).toHaveResourceCount(1);
  });
});
