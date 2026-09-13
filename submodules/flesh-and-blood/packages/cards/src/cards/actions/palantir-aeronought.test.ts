import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { maskOfMomentum } from "../equipment/mask-of-momentum.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { palantirAeronoughtRed } from "./palantir-aeronought.ts";

/**
 * Palantir Aeronought (SEA012) — Mechanologist Action Attack.
 *
 * Printed: The defending hero must defend this with an equipment they control
 *          if able.
 *          Thrice per Turn Instant - {t} a cog you control: This gets +1{p}.
 *          If this is the third time you've activated this ability, destroy a
 *          defending card.
 */

describe("Palantir Aeronought (SEA012) AAA", () => {
  it("happy: the defending hero must include an equipment they control if able", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [palantirAeronoughtRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [maskOfMomentum],
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(palantirAeronoughtRed);
    expectCombat(game).toHaveAttackPower(6);

    expect(() => Bravo.defendWith(snatchRed)).toThrow(
      /must defend with a matching card they control if able/,
    );

    Bravo.defendWith(snatchRed, maskOfMomentum);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: without a controlled equipment, a hand defense is legal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [palantirAeronoughtRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(palantirAeronoughtRed);
    Bravo.defendWith(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("happy: the third activation this turn destroys a defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [palantirAeronoughtRed],
        arena: [goldenCog, goldenCog, goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [maskOfMomentum],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(palantirAeronoughtRed);
    Bravo.defendWith(maskOfMomentum);

    const cogs = Dash.cardsIn("arena", goldenCog);
    Dash.activate(palantirAeronoughtRed);
    Dash.target(cogs[0]!);
    game.passBoth();
    Dash.activate(palantirAeronoughtRed);
    Dash.target(cogs[1]!);
    game.passBoth();
    Dash.activate(palantirAeronoughtRed);
    Dash.target(cogs[2]!);
    game.passBoth();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Bravo, maskOfMomentum).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(11);
  });

  it("boundary: the first activation only gives +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [palantirAeronoughtRed],
        arena: [goldenCog, goldenCog, goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [maskOfMomentum],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(palantirAeronoughtRed);
    Bravo.defendWith(maskOfMomentum);
    Dash.activate(palantirAeronoughtRed);
    Dash.target(Dash.cardsIn("arena", goldenCog)[0]!);
    game.passBoth();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(15);
  });
});
