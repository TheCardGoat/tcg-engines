import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { snatchRed } from "./snatch.ts";
import { precisionPressRed } from "./precision-press.ts";

/**
 * Precision Press (DYN076) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next sword or dagger attack this turn has go again and
 * piercing 3. Go again"
 */

describe("Precision Press (DYN076) AAA", () => {
  it("happy: the next sword attack has go again and piercing 3", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [precisionPressRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(precisionPressRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kassai).toHaveAP(1);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);

    // Cintari Saber 2{p} + piercing 3 while equipment defends = 5.
    expectCombat(game).toHaveKeyword("go-again").toHaveKeyword("piercing").toHaveAttackPower(5);
  });

  it("boundary: a non-sword, non-dagger attack does not gain go again or piercing", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [precisionPressRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(precisionPressRed);
    game.helpers.resolveUntilIdle();
    Kassai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);

    expectCombat(game)
      .notToHaveKeyword("go-again")
      .notToHaveKeyword("piercing")
      .toHaveAttackPower(4);
  });

  it("timing: the grant expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [precisionPressRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(precisionPressRed);
    game.helpers.resolveUntilIdle();
    Kassai.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    Kassai.must.activate(cintariSaber);
    game.answerDecision(Kassai.id, {
      kind: "payment",
      instanceIds: [Kassai.cardIn("hand", snatchRed).instanceId],
    });
    game.advanceCombatTo("defend");
    Dash.defendWith(ironrotGauntlet);

    expectCombat(game)
      .notToHaveKeyword("go-again")
      .notToHaveKeyword("piercing")
      .toHaveAttackPower(2);
  });
});
