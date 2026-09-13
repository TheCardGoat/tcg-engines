import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { snatchRed } from "./snatch.ts";
import { phantasmifyBlue, phantasmifyRed, phantasmifyYellow } from "./phantasmify.ts";

const variants = [
  { label: "Phantasmify Red (MON095)", card: phantasmifyRed, powerBonus: 5 },
  { label: "Phantasmify Yellow (MON096)", card: phantasmifyYellow, powerBonus: 4 },
  { label: "Phantasmify Blue (MON097)", card: phantasmifyBlue, powerBonus: 3 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it(`happy: next attack action gains +${powerBonus}{p} and phantasm`, () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [card, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(card);
    game.untilIdle();
    expectFabPlayer(Prism).toHaveAP(1);

    Prism.playAttack(snatchRed);
    expectCombat(game)
      .toHaveAttackPower(4 + powerBonus)
      .toHaveKeyword("phantasm")
      .toHaveAttackSupertype("Illusionist");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(16 - powerBonus);
    expectFabCard(Prism, card).toBeIn("graveyard");
  });

  it(`boundary: the second attack action this turn does not keep +${powerBonus}{p} or phantasm`, () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [card, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(card);
    game.untilIdle();
    Prism.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline" });
    Prism.playAttack(snatchRed);
    expectCombat(game)
      .toHaveAttackPower(4)
      .notToHaveKeyword("phantasm")
      .notToHaveAttackSupertype("Illusionist");
  });

  it("timing: a 6-power attack-action defender triggers the granted Phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [card, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [wreckerRompBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(card);
    game.untilIdle();
    Prism.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(wreckerRompBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Prism, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
    expectCombat(game).toBeClosed();
  });
});
