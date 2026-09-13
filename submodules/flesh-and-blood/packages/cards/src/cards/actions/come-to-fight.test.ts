import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { comeToFightBlue, comeToFightRed, comeToFightYellow } from "./come-to-fight.ts";

const variants = [
  { label: "Come to Fight Red (ARC203)", card: comeToFightRed, powerBonus: 3 },
  { label: "Come to Fight Yellow (ARC204)", card: comeToFightYellow, powerBonus: 2 },
  { label: "Come to Fight Blue (ARC205)", card: comeToFightBlue, powerBonus: 1 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it("happy: the next attack action gains its pitch-scaled power bonus", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, brutalAssaultBlue], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4 + powerBonus);
    expectFabCard(Bravo, card).toBeIn("graveyard");
  });

  it("boundary: without Come to Fight, the attack keeps its printed power", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Come to Fight", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
