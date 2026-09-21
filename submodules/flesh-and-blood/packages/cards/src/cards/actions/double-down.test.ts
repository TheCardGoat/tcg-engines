import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { betsy } from "../heroes/betsy.ts";
import { betBigRed } from "./bet-big.ts";
import { might } from "../tokens/might.ts";
import { gold } from "../tokens/gold.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { wageGoldBlue } from "./wage-gold.ts";
import { unmovableBlue } from "../defense-reactions/unmovable.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { victorGoldmane } from "../heroes/victor-goldmane.ts";
import { visitGoldmaneEstateBlue } from "./visit-goldmane-estate.ts";
import { doubleDownRed } from "./double-down.ts";

/**
 * Double Down (HVY176) — Guardian/Warrior Action.
 *
 * Printed delayed effect: the next attack that wagers this turn gets +3 power
 * and overpower. Wager-created tokens are also increased by one this turn.
 */

describe("Double Down (HVY176) AAA", () => {
  it("happy: the next wagering attack gets +3 power and overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed, wageGoldBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: realPadding,
      },
      { hero: dash, hand: [], life: 20, deck: realPadding },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doubleDownRed);
    game.untilIdle({ optionals: "decline" });
    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("overpower");

    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 2);
  });

  it("boundary: declining the wager does not consume or apply the delayed trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed, wageGoldBlue, wageGoldBlue],
        resourcePoints: 8,
        actionPoints: 2,
        deck: realPadding,
      },
      { hero: dash, hand: [], life: 30, deck: realPadding },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doubleDownRed);
    game.untilIdle({ optionals: "decline" });
    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(5).notToHaveKeyword("overpower");
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(25);

    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 2).toHaveAP(0);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectWait(game).toBeIdle();
  });

  it("timing: only the first wagering attack this turn receives the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed, wageGoldBlue, wageGoldBlue],
        resourcePoints: 8,
        actionPoints: 2,
        deck: realPadding,
      },
      { hero: dash, hand: [], life: 30, deck: realPadding },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doubleDownRed);
    game.untilIdle({ optionals: "decline" });

    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ ordering: "listed" });

    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 4);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});

const realPadding = [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];
for (const doubled of [false, true]) {
  it(`opponent wins a fully defended wager and creates ${doubled ? 2 : 1} Gold ${doubled ? "with" : "without"} Double Down`, () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: doubled ? [doubleDownRed, wageGoldBlue] : [wageGoldBlue],
        resourcePoints: 5,
        deck: realPadding,
      },
      {
        hero: dash,
        hand: [commandAndConquerRed, nimblismBlue, unmovableBlue],
        resourcePoints: 3,
        life: 20,
        deck: realPadding,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    if (doubled) {
      Bravo.play(doubleDownRed);
      game.untilIdle();
      expectFabPlayer(Bravo).toHaveAP(1);
    }
    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(doubled ? 8 : 5);
    if (doubled) {
      const rejection = Dash.expectBlockRejected([commandAndConquerRed, nimblismBlue]);
      expect(rejection.errorCode).toBe("overpower");
      expectFabCard(Dash, commandAndConquerRed).toBeIn("hand");
      expectFabCard(Dash, nimblismBlue).toBeIn("hand");
      Dash.defendWith(commandAndConquerRed);
    } else {
      Dash.defendWith([commandAndConquerRed, nimblismBlue]);
    }
    game.toReaction("defender");
    Dash.play(unmovableBlue);
    game.closeCombat();

    expectFabPlayer(Dash)
      .toHaveLife(20)
      .toHaveTokenCount("gold", doubled ? 2 : 1);
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0).toHaveAP(0);
    expectCombat(game).toBeClosed();
    expectWait(game).toBeIdle();
  });
}

it("Double Down leaves non-wager Gold unchanged without consuming its later wager bonus", () => {
  const game = FabTestEngine.start(
    {
      hero: victorGoldmane,
      hand: [doubleDownRed, visitGoldmaneEstateBlue, wageGoldBlue],
      resourcePoints: 6,
      deck: realPadding,
    },
    { hero: dash, hand: [], life: 20, deck: realPadding },
    FAB_MANUAL_HARNESS,
  );
  const Victor = game.as(victorGoldmane);
  const Dash = game.as(dash);
  Victor.play(doubleDownRed);
  game.untilIdle();
  Victor.play(visitGoldmaneEstateBlue);
  game.untilIdle();
  expectFabPlayer(Victor).toHaveTokenCount("gold", 1).toHaveTokenCount("might", 0);

  Victor.playAttack(wageGoldBlue, { stopAt: "on-attack" });
  Victor.accept();
  game.advanceUntil({ stopAt: "defend" });
  expectCombat(game).toHaveAttackPower(8);
  game.closeCombat();

  expectFabPlayer(Victor).toHaveTokenCount("gold", 3).toHaveAP(0);
  expectFabPlayer(Dash).toHaveLife(12);
  expectWait(game).toBeIdle();
});

for (const destroyGold of [false, true]) {
  it(`Double Down ${destroyGold ? "destroys freshly created Gold instead of paying resources" : "can pay resources while retaining freshly created Gold"}`, () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [visitGoldmaneEstateBlue, doubleDownRed, wageGoldBlue],
        resourcePoints: destroyGold ? 4 : 6,
        deck: realPadding,
      },
      { hero: dash, hand: [], life: 20, deck: realPadding },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);
    Victor.play(visitGoldmaneEstateBlue);
    game.untilIdle();
    expectFabPlayer(Victor).toHaveTokenCount("gold", 1);
    Victor.play(doubleDownRed, { modeIds: [destroyGold ? "pay" : "decline"] });
    expectFabPlayer(Victor).toHaveAP(0);
    game.untilIdle();
    expectFabPlayer(Victor)
      .toHaveTokenCount("gold", destroyGold ? 0 : 1)
      .toHaveResourceCount(3)
      .toHaveAP(1);
    Victor.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Victor.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();
    expectFabPlayer(Victor)
      .toHaveTokenCount("gold", destroyGold ? 2 : 3)
      .toHaveResourceCount(0)
      .toHaveAP(0);
    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectWait(game).toBeIdle();
  });
}

for (const opposingGold of [false, true]) {
  it(`Double Down cannot pay its Gold alternative with ${opposingGold ? "only opposing Gold" : "no Gold"}`, () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed],
        arsenal: [nimblismBlue],
        resourcePoints: 0,
        deck: realPadding,
      },
      { hero: dash, hand: [], arena: opposingGold ? [gold] : [], life: 20, deck: realPadding },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expectFabUnplayable(
      () => Bravo.play(doubleDownRed, { modeIds: ["pay"] }),
      /resource cost cannot be paid/i,
    );
    expectFabCard(Bravo, doubleDownRed).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveAP(1).toHaveResourceCount(0).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash)
      .toHaveTokenCount("gold", opposingGold ? 1 : 0)
      .toHaveLife(20);
    // A legal zero-cost play from arsenal demonstrates that reversal resumes play.
    Bravo.play(nimblismBlue, { from: "arsenal" });
    game.untilIdle();
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectWait(game).toBeIdle();
  });
}

it("Double Down's unused attack bonus and wager token bonus expire at turn handoff", () => {
  const game = FabTestEngine.start(
    { hero: bravo, hand: [doubleDownRed], resourcePoints: 2, life: 20, deck: realPadding },
    { hero: dash, hand: [wageGoldBlue, nimblismBlue], deck: realPadding },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);
  Bravo.play(doubleDownRed);
  game.untilIdle();
  Bravo.endTurn();
  Dash.playAttack(wageGoldBlue, { pitch: nimblismBlue, stopAt: "on-attack" });
  Dash.accept();
  game.advanceUntil({ stopAt: "defend" });
  expectCombat(game).toHaveAttackPower(5);
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(15).toHaveTokenCount("gold", 0);
  expectFabPlayer(Dash).toHaveTokenCount("gold", 1).toHaveAP(0);
  expectWait(game).toBeIdle();
});

for (const doubled of [false, true]) {
  it(`Bet Big creates ${doubled ? 2 : 1} of each wagered token ${doubled ? "with" : "without"} Double Down`, () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: doubled ? [doubleDownRed, betBigRed] : [betBigRed],
        resourcePoints: doubled ? 6 : 4,
        deck: realPadding,
      },
      { hero: dash, hand: [], life: 20, deck: realPadding },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    if (doubled) {
      Betsy.play(doubleDownRed);
      game.untilIdle();
    }
    Betsy.playAttack(betBigRed, { stopAt: "on-attack" });
    Betsy.accept();
    // Betsy's optional payment is unpayable; its inert trigger commutes with the bonus.
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabPlayer(Betsy).toHaveResourceCount(0);
    expectCombat(game).toHaveAttackPower(doubled ? 11 : 8);
    game.closeCombat();
    expectFabPlayer(Betsy)
      .toHaveTokenCount("gold", doubled ? 2 : 1)
      .toHaveTokenCount("might", doubled ? 2 : 1)
      .toHaveTokenCount("vigor", doubled ? 2 : 1)
      .toHaveAP(0);
    expectFabPlayer(game.as(dash))
      .toHaveLife(doubled ? 9 : 12)
      .toHaveTokenCount("gold", 0)
      .toHaveTokenCount("might", 0)
      .toHaveTokenCount("vigor", 0);
    expectWait(game).toBeIdle();
  });
}

it("Double Down destroys the chosen second Gold and preserves the first physical Gold", () => {
  const game = FabTestEngine.start(
    {
      hero: victorGoldmane,
      hand: [visitGoldmaneEstateBlue, visitGoldmaneEstateBlue, doubleDownRed, wageGoldBlue],
      resourcePoints: 5,
      deck: realPadding,
    },
    { hero: dash, hand: [], life: 20, deck: realPadding },
    FAB_MANUAL_HARNESS,
  );
  const Victor = game.as(victorGoldmane);
  Victor.play(visitGoldmaneEstateBlue);
  game.untilIdle();
  Victor.play(visitGoldmaneEstateBlue);
  game.untilIdle();
  const [first, second] = Victor.cardsIn("arena", "token:gold");
  if (!first || !second) throw new Error("Both played Visits must create a Gold.");
  expectFabPlayer(Victor).toHaveTokenCount("gold", 2);
  Victor.play(doubleDownRed, { modeIds: ["pay"], targetCard: second });
  game.untilIdle();
  expectFabCard(Victor, first).toBeIn("arena");
  expectFabPlayer(Victor).toHaveTokenCount("gold", 1).toHaveResourceCount(3).toHaveAP(1);
  Victor.playAttack(wageGoldBlue, { stopAt: "on-attack" });
  Victor.accept();
  game.advanceUntil({ stopAt: "defend" });
  expectCombat(game).toHaveAttackPower(8);
  game.closeCombat();
  expectFabPlayer(Victor).toHaveTokenCount("gold", 3).toHaveAP(0);
  expectFabPlayer(game.as(dash)).toHaveLife(12);
  expectWait(game).toBeIdle();
});

it("Double Down cannot substitute a controlled Might for its Gold cost", () => {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [doubleDownRed],
      arena: [might],
      arsenal: [nimblismBlue],
      resourcePoints: 0,
      deck: realPadding,
    },
    { hero: dash, hand: [], deck: realPadding },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  expectFabUnplayable(
    () => Bravo.play(doubleDownRed, { modeIds: ["pay"] }),
    /resource cost cannot be paid/i,
  );
  expectFabCard(Bravo, doubleDownRed).toBeIn("hand");
  expectFabCard(Bravo, might).toBeIn("arena");
  expectFabPlayer(Bravo).toHaveAP(1).toHaveResourceCount(0).toHaveTokenCount("might", 1);
  Bravo.play(nimblismBlue, { from: "arsenal" });
  game.untilIdle();
  expectFabPlayer(Bravo).toHaveAP(1).toHaveTokenCount("might", 1);
  expectWait(game).toBeIdle();
});

it("two Double Downs add to the modified wager count instead of replacing it with two", () => {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [doubleDownRed, doubleDownRed, wageGoldBlue],
      resourcePoints: 7,
      deck: realPadding,
    },
    { hero: dash, hand: [], life: 20, deck: realPadding },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  Bravo.play(doubleDownRed);
  game.untilIdle();
  Bravo.play(doubleDownRed);
  game.untilIdle();
  expectFabPlayer(Bravo).toHaveAP(1).toHaveResourceCount(3);
  Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
  Bravo.accept();
  // Both +3 effects and both +1 token replacements commute.
  game.advanceUntil({ stopAt: "defend", ordering: "listed" });
  expectCombat(game).toHaveAttackPower(11);
  game.closeCombat({ ordering: "listed" });
  expectFabPlayer(Bravo).toHaveTokenCount("gold", 3).toHaveAP(0).toHaveResourceCount(0);
  expectFabPlayer(game.as(dash)).toHaveLife(9).toHaveTokenCount("gold", 0);
  expectWait(game).toBeIdle();
});

it("Double Down pitches for one and defends for three without applying its played effects", () => {
  const game = FabTestEngine.start(
    { hero: bravo, hand: [doubleDownRed, wageGoldBlue], resourcePoints: 2, deck: realPadding },
    { hero: victorGoldmane, hand: [doubleDownRed], resourcePoints: 0, life: 20, deck: realPadding },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  const Victor = game.as(victorGoldmane);
  Bravo.playAttack(wageGoldBlue, { pitch: doubleDownRed, stopAt: "on-attack" });
  Bravo.accept();
  game.advanceUntil({ stopAt: "defend" });
  expectFabPlayer(Bravo).toHaveResourceCount(0);
  expectFabCard(Bravo, doubleDownRed).toBeIn("pitch");
  expectCombat(game).toHaveAttackPower(5);
  Victor.defendWith(doubleDownRed);
  game.closeCombat();
  expectFabPlayer(Victor).toHaveLife(18).toHaveTokenCount("gold", 0);
  expectFabCard(Victor, doubleDownRed).toBeIn("graveyard");
  expectFabPlayer(Bravo).toHaveTokenCount("gold", 1).toHaveAP(0);
  expectFabCard(Bravo, doubleDownRed).toBeIn("pitch");
  expectCombat(game).toBeClosed();
  expectWait(game).toBeIdle();
});
