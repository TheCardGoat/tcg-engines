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
import { sloggismBlue, sloggismRed, sloggismYellow } from "./sloggism.ts";

const variants = [
  { label: "Sloggism Red (WTR221)", card: sloggismRed, powerBonus: 6 },
  { label: "Sloggism Yellow (WTR222)", card: sloggismYellow, powerBonus: 5 },
  { label: "Sloggism Blue (BVO029)", card: sloggismBlue, powerBonus: 4 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it("happy: an attack action with cost 2 or greater gains the bonus", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, brutalAssaultBlue], resourcePoints: 5, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4 + powerBonus);
  });

  it("boundary: an attack action with cost below 2 is not modified", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, woundingBlowBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(woundingBlowBlue);

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: go again refunds the action point spent to play Sloggism", () => {
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
