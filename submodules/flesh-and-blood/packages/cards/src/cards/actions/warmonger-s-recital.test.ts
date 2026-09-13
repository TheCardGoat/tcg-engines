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
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import {
  warmongerSRecitalBlue,
  warmongerSRecitalRed,
  warmongerSRecitalYellow,
} from "./warmonger-s-recital.ts";
import { nimblismBlue } from "./nimblism.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";

const variants = [
  { label: "Warmonger's Recital Red (CHN028)", card: warmongerSRecitalRed, powerBonus: 3 },
  { label: "Warmonger's Recital Yellow (CHN029)", card: warmongerSRecitalYellow, powerBonus: 2 },
  { label: "Warmonger's Recital Blue (MON301)", card: warmongerSRecitalBlue, powerBonus: 1 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it("happy: a hit buffs the attack and moves it to the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, snatchRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4 + powerBonus);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(20 - (4 + powerBonus));
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Bravo, card).toBeIn("graveyard");
  });

  it("boundary: a fully defended attack is not moved to the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [card, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, brutalAssaultBlue, woundingBlowBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue, brutalAssaultBlue, woundingBlowBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expect(Bravo.zone("deck")).not.toContain(snatchRed.canonicalId);
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });

  it("timing: go again refunds the action point spent to play Warmonger's Recital", () => {
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
