import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { leadTheChargeBlue, leadTheChargeRed, leadTheChargeYellow } from "./lead-the-charge.ts";

const variants = [
  { label: "Lead the Charge Red (ARC209)", card: leadTheChargeRed, threshold: 0 },
  { label: "Lead the Charge Yellow (ARC210)", card: leadTheChargeYellow, threshold: 1 },
  { label: "Lead the Charge Blue (ARC211)", card: leadTheChargeBlue, threshold: 2 },
] as const;

describe.each(variants)("$label AAA", ({ card, threshold }) => {
  it("happy: the first matching action card restores an action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, card).toBeIn("graveyard");
  });

  it("boundary: an action below the threshold does not consume the delayed trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [card, woundingBlowBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(woundingBlowBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveAP(threshold === 0 ? 1 : 0);
  });

  it("timing: the delayed trigger expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, woundingBlowBlue], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();
    Bravo.playAttack(woundingBlowBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveAP(0);
  });
});
