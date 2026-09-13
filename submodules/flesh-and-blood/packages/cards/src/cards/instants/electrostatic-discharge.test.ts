import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "../actions/fry.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { briar } from "../shared/test-recipients.ts";
import {
  electrostaticDischargeBlue,
  electrostaticDischargeRed,
  electrostaticDischargeYellow,
} from "./electrostatic-discharge.ts";

const variants = [
  { label: "Electrostatic Discharge Red (AUA018)", card: electrostaticDischargeRed, amount: 3 },
  {
    label: "Electrostatic Discharge Yellow (ROS111)",
    card: electrostaticDischargeYellow,
    amount: 2,
  },
  { label: "Electrostatic Discharge Blue (AUA024)", card: electrostaticDischargeBlue, amount: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: the next cost-1-or-less attack action gains +${amount}{p}`, () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [card, fryRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(card);
    game.untilIdle();
    Briar.playAttack(fryRed);

    expectCombat(game).toHaveAttackPower(3 + amount);
  });

  it("boundary: a cost-2 attack action does not receive the power bonus", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [card, brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(card);
    game.untilIdle();
    Briar.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the modifier is consumed by the first matching attack", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [card, snatchRed, snatchRed], actionPoints: 3, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const snatches = Briar.cardsIn("hand", snatchRed);

    Briar.play(card);
    game.untilIdle();
    Briar.playAttack(snatches[0]!);
    expectCombat(game).toHaveAttackPower(4 + amount);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Briar.playAttack(snatches[1]!);
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
