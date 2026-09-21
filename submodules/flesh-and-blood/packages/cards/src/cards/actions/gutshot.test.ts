import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { olympia } from "../heroes/olympia.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { hitAndRunBlue } from "./hit-and-run.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { scarForAScarRed } from "./scar-for-a-scar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { gutshotRed, gutshotYellow, gutshotBlue } from "./gutshot.ts";

// MPW109/110/111; CR8.5.46a/b. Independent oracle in campaign evidence/gutshot-oracle.md.
for (const [card, color, bonus, defenders] of [
  [gutshotRed, "red", 3, [brutalAssaultBlue, nimblismBlue, nimblismBlue]],
  [gutshotYellow, "yellow", 2, [brutalAssaultBlue, brutalAssaultBlue]],
  [gutshotBlue, "blue", 1, [brutalAssaultBlue, nimblismBlue]],
] as const) {
  describe(`Gutshot ${color}`, () => {
    for (const blocked of [false, true]) {
      it(
        blocked
          ? "equal defense misses and gives only the defender a Blade Dance"
          : "a hit gives only the attacker a Blade Dance after damage",
        () => {
          const game = FabTestEngine.start(
            {
              hero: olympia,
              weapon1: [goldenGrail],
              hand: [card],
              resourcePoints: 3,
              actionPoints: 1,
              deck: [nimblismBlue, nimblismBlue],
            },
            { hero: bravo, hand: [...defenders], life: 20, deck: [nimblismBlue, nimblismBlue] },
            FAB_MANUAL_HARNESS,
          );
          const Olympia = game.as(olympia);
          const Bravo = game.as(bravo);
          Olympia.play(card);
          game.untilIdle();
          Olympia.activateAttack(goldenGrail);
          expectCombat(game).toHaveAttackPower(4 + bonus);
          expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 0);
          expectFabPlayer(Bravo).toHaveTokenCount("blade-dance", 0);
          Bravo.defendWith(...(blocked ? defenders : []));
          game.closeCombat();
          expectFabPlayer(Bravo)
            .toHaveLife(blocked ? 20 : 16 - bonus)
            .toHaveTokenCount("blade-dance", blocked ? 1 : 0);
          expectFabPlayer(Olympia)
            .toHaveTokenCount("blade-dance", blocked ? 0 : 1)
            .toHaveTokenCount("gold", blocked ? 0 : 1);
        },
      );
    }

    it("an intervening non-Sword attack neither benefits nor consumes the Sword bonus and wager", () => {
      const game = FabTestEngine.start(
        {
          hero: olympia,
          weapon1: [goldenGrail],
          hand: [card, scarForAScarRed],
          life: 10,
          resourcePoints: 3,
          actionPoints: 1,
          deck: [nimblismBlue, nimblismBlue],
        },
        { hero: bravo, hand: [], life: 20, deck: [nimblismBlue, nimblismBlue] },
        FAB_MANUAL_HARNESS,
      );
      const Olympia = game.as(olympia);
      const Bravo = game.as(bravo);
      Olympia.play(card);
      game.untilIdle();
      Olympia.playAttack(scarForAScarRed);
      expectCombat(game).toHaveAttackPower(4);
      Bravo.defendWith();
      game.closeCombat();
      expectFabPlayer(Bravo).toHaveLife(16).toHaveTokenCount("blade-dance", 0);
      expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 0).toHaveTokenCount("gold", 0);
      Olympia.activateAttack(goldenGrail);
      expectCombat(game).toHaveAttackPower(4 + bonus);
      Bravo.defendWith();
      game.closeCombat();
      expectFabPlayer(Bravo).toHaveLife(12 - bonus);
      expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 1).toHaveTokenCount("gold", 1);
    });

    it("only the first of two Swords gets the bonus and wager", () => {
      const game = FabTestEngine.start(
        {
          hero: olympia,
          weapon1: [cintariSaber],
          weapon2: [cintariSaber],
          hand: [card, hitAndRunBlue],
          resourcePoints: 3,
          actionPoints: 1,
          deck: [nimblismBlue, nimblismBlue],
        },
        { hero: bravo, hand: [], life: 20, deck: [nimblismBlue, nimblismBlue] },
        FAB_MANUAL_HARNESS,
      );
      const Olympia = game.as(olympia);
      const Bravo = game.as(bravo);
      Olympia.play(card);
      game.untilIdle();
      Olympia.play(hitAndRunBlue);
      game.untilIdle();
      Olympia.activateAttack(cintariSaber, { index: 0 });
      expectCombat(game).toHaveAttackPower(2 + bonus);
      Bravo.defendWith();
      game.closeCombat();
      expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 1).toHaveTokenCount("gold", 1);
      Olympia.activateAttack(cintariSaber, { index: 1 });
      expectCombat(game).toHaveAttackPower(2);
      Bravo.defendWith();
      game.closeCombat();
      expectFabPlayer(Bravo)
        .toHaveLife(16 - bonus)
        .toHaveTokenCount("blade-dance", 0);
      expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 0).toHaveTokenCount("gold", 1);
    });

    it("unused bonus and wager expire before the next turn", () => {
      const game = FabTestEngine.start(
        {
          hero: olympia,
          weapon1: [goldenGrail],
          hand: [card],
          resourcePoints: 1,
          actionPoints: 1,
          deck: [
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
            nimblismBlue,
          ],
        },
        {
          hero: bravo,
          hand: [],
          life: 20,
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        FAB_MANUAL_HARNESS,
      );
      const Olympia = game.as(olympia);
      const Bravo = game.as(bravo);
      Olympia.play(card);
      game.untilIdle();
      Olympia.endTurn();
      Bravo.endTurn();
      Olympia.activate(goldenGrail);
      const [payment] = Olympia.cardsIn("hand", nimblismBlue);
      if (!payment) throw new Error("Expected drawn blue Nimblism payment");
      game.answerDecision(Olympia.id, { kind: "payment", instanceIds: [payment.instanceId] });
      game.advanceUntil({ stopAt: "defend" });
      expectCombat(game).toHaveAttackPower(3);
      Bravo.defendWith();
      game.closeCombat();
      expectFabPlayer(Bravo).toHaveLife(17).toHaveTokenCount("blade-dance", 0);
      expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 0).toHaveTokenCount("gold", 0);
    });
  });
}
