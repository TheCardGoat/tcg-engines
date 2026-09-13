import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoWhizzBangYellow } from "./evo-whizz-bang.ts";

describe("Evo Whizz Bang (EVO052) AAA", () => {
  it("happy: transforming a base head equips this to arms", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [snatchRed, evoWhizzBangYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.toReaction("attacker");
    Teklo.play(evoWhizzBangYellow);
    game.passBoth();
    Teklo.target();

    expectFabCard(Teklo, evoWhizzBangYellow).toBeIn("arms");
    expect(Teklo.zone("head")).not.toContain(tekloBaseHead.canonicalId);
    expectCombat(game).toBeOpen();
  });

  it("boundary: without a base head this does not enter the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoWhizzBangYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoWhizzBangYellow);
    game.helpers.resolveUntilIdle();

    expect(Teklo.zone("arms")).not.toContain(evoWhizzBangYellow.canonicalId);
    expectFabCard(Teklo, evoWhizzBangYellow).toBeIn("graveyard");
  });

  it("timing: declining the up-to attack leaves printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [snatchRed, evoWhizzBangYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(snatchRed);
    game.toReaction("attacker");
    Teklo.play(evoWhizzBangYellow);
    game.passBoth();
    Teklo.target();

    expectFabCard(Teklo, evoWhizzBangYellow).toBeIn("arms");
    expectCombat(game).toHaveAttackPower(4);
  });
});
