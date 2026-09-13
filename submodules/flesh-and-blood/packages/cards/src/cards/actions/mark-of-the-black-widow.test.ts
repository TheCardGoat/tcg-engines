import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { markOfTheBlackWidowRed } from "./mark-of-the-black-widow.ts";

describe("Mark of the Black Widow (HNT032) AAA", () => {
  it("happy: hitting a marked hero banishes a card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheBlackWidowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheBlackWidowRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("boundary: hitting an unmarked hero does not banish from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheBlackWidowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheBlackWidowRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: a miss against a marked hero does not banish", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheBlackWidowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, brutalAssaultBlue], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheBlackWidowRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(Dash).toBeMarked();
  });
});
