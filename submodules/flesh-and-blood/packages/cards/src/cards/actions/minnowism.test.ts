import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { minnowismBlue, minnowismRed, minnowismYellow } from "./minnowism.ts";

const variants = [
  { label: "Minnowism Red (MON296)", card: minnowismRed, powerBonus: 3 },
  { label: "Minnowism Yellow (MON297)", card: minnowismYellow, powerBonus: 2 },
  { label: "Minnowism Blue (MON298)", card: minnowismBlue, powerBonus: 1 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it("happy: an attack action with 3 or less base power gains the bonus", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, woundingBlowBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(woundingBlowBlue);

    expectCombat(game).toHaveAttackPower(2 + powerBonus);
  });

  it("boundary: an attack action with more than 3 base power is not modified", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Minnowism", () => {
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
