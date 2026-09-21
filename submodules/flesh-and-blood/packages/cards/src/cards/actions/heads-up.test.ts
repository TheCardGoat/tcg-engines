import { describe, expect, it } from "vitest";
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
import { headsUpRed } from "./heads-up.ts";
import { gutshotRed, gutshotYellow, gutshotBlue } from "./gutshot.ts";
import { scarForAScarRed } from "./scar-for-a-scar.ts";
import { nimblismBlue } from "./nimblism.ts";

// CR 6.6.1c/d, 6.6.6b, 6.2.2d: the conditional effect is checked on resolution.
// Full independent oracle: campaign evidence/heads-up-wager-oracle.md.
describe("Heads Up wager timing", () => {
  for (const [gutshot, bonus, color] of [
    [gutshotRed, 3, "red"],
    [gutshotYellow, 2, "yellow"],
    [gutshotBlue, 1, "blue"],
  ] as const) {
    for (const wagerFirst of [true, false]) {
      it(`${color} Gutshot resolving ${wagerFirst ? "before" : "after"} Heads Up ${wagerFirst ? "restricts" : "permits"} two hand defenders`, () => {
        const game = FabTestEngine.start(
          {
            hero: olympia,
            weapon1: [goldenGrail],
            hand: [headsUpRed, gutshot],
            resourcePoints: 4,
            actionPoints: 1,
            deck: [nimblismBlue, nimblismBlue],
          },
          {
            hero: bravo,
            hand: [nimblismBlue, nimblismBlue],
            life: 20,
            deck: [nimblismBlue, nimblismBlue],
          },
          FAB_MANUAL_HARNESS,
        );
        const Olympia = game.as(olympia);
        const Bravo = game.as(bravo);
        Olympia.play(headsUpRed);
        game.untilIdle();
        Olympia.play(gutshot);
        game.untilIdle();
        Olympia.activate(goldenGrail);
        const ordering = game.advanceToDecision(Olympia, "ordering");
        const heads = ordering.entries.find((entry) =>
          entry.label.includes("triggeredAttackCompareAmountCountThisChainLink"),
        );
        const wager = ordering.entries.find((entry) => entry.label.includes("wagerOnAttack"));
        if (!heads || !wager) throw new Error("Expected Heads Up and Gutshot attack triggers");
        // Entries are added bottom-to-top; the final entry resolves first.
        game.answerDecision(Olympia.id, {
          kind: "ordering",
          orderedIds: wagerFirst ? [heads.id, wager.id] : [wager.id, heads.id],
        });
        game.advanceUntil({ stopAt: "defend" });
        expectCombat(game).toHaveAttackPower(7 + bonus);
        if (wagerFirst) {
          expect(Bravo.expectBlockRejected([nimblismBlue, nimblismBlue]).errorCode).toBe(
            "dominate",
          );
          Bravo.defendWith(nimblismBlue);
        } else {
          Bravo.defendWith(nimblismBlue, nimblismBlue);
        }
        game.closeCombat();
        expectFabPlayer(Bravo)
          .toHaveLife(20 - (7 + bonus - (wagerFirst ? 2 : 4)))
          .toHaveTokenCount("blade-dance", 0);
        expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 1).toHaveTokenCount("gold", 1);
      });
    }
  }
});

it("without a wager Heads Up adds three power but permits two hand defenders", () => {
  const game = FabTestEngine.start(
    {
      hero: olympia,
      weapon1: [goldenGrail],
      hand: [headsUpRed],
      resourcePoints: 3,
      actionPoints: 1,
      deck: [nimblismBlue, nimblismBlue],
    },
    {
      hero: bravo,
      hand: [nimblismBlue, nimblismBlue],
      life: 20,
      deck: [nimblismBlue, nimblismBlue],
    },
    FAB_MANUAL_HARNESS,
  );
  const Olympia = game.as(olympia);
  const Bravo = game.as(bravo);
  Olympia.play(headsUpRed);
  game.untilIdle();
  Olympia.activateAttack(goldenGrail);
  expectCombat(game).toHaveAttackPower(6);
  Bravo.defendWith(nimblismBlue, nimblismBlue);
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(18);
  expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 0).toHaveTokenCount("gold", 0);
});

it("a non-Sword attack receives no bonus and leaves Heads Up for the following Sword", () => {
  const game = FabTestEngine.start(
    {
      hero: olympia,
      weapon1: [goldenGrail],
      hand: [headsUpRed, scarForAScarRed],
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
  Olympia.play(headsUpRed);
  game.untilIdle();
  Olympia.playAttack(scarForAScarRed);
  expectCombat(game).toHaveAttackPower(4);
  Bravo.defendWith();
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(16);
  Olympia.activateAttack(goldenGrail);
  expectCombat(game).toHaveAttackPower(6);
  Bravo.defendWith();
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(10);
});

it("Heads Up is consumed by the first of two physical Sword attacks", () => {
  const game = FabTestEngine.start(
    {
      hero: olympia,
      weapon1: [cintariSaber],
      weapon2: [cintariSaber],
      hand: [headsUpRed, hitAndRunBlue],
      resourcePoints: 3,
      actionPoints: 1,
      deck: [nimblismBlue, nimblismBlue],
    },
    { hero: bravo, hand: [], life: 20, deck: [nimblismBlue, nimblismBlue] },
    FAB_MANUAL_HARNESS,
  );
  const Olympia = game.as(olympia);
  const Bravo = game.as(bravo);
  Olympia.play(headsUpRed);
  game.untilIdle();
  Olympia.play(hitAndRunBlue);
  game.untilIdle();
  Olympia.activateAttack(cintariSaber, { index: 0 });
  expectCombat(game).toHaveAttackPower(5);
  Bravo.defendWith();
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(15);
  Olympia.activateAttack(cintariSaber, { index: 1 });
  expectCombat(game).toHaveAttackPower(2);
  Bravo.defendWith();
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(13);
});

for (const used of [false, true]) {
  it(`${used ? "used" : "unused"} Heads Up expires before the next turn's Sword attack`, () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        weapon1: [goldenGrail],
        hand: [headsUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);
    const Bravo = game.as(bravo);
    Olympia.play(headsUpRed);
    game.untilIdle();
    if (used) {
      Olympia.activateAttack(goldenGrail);
      expectCombat(game).toHaveAttackPower(6);
      Bravo.defendWith();
      game.closeCombat();
    }
    Olympia.endTurn();
    Bravo.endTurn();
    Olympia.activate(goldenGrail);
    const [paymentCard] = Olympia.cardsIn("hand", nimblismBlue);
    if (!paymentCard) throw new Error("Expected a drawn blue Nimblism for payment");
    game.answerDecision(Olympia.id, { kind: "payment", instanceIds: [paymentCard.instanceId] });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveLife(used ? 14 : 20);
  });
}

it("dominate actually granted by Heads Up does not restrict a wagered Sword next turn", () => {
  const game = FabTestEngine.start(
    {
      hero: olympia,
      weapon1: [goldenGrail],
      hand: [headsUpRed, gutshotRed, gutshotBlue],
      resourcePoints: 4,
      actionPoints: 1,
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    {
      hero: bravo,
      hand: [nimblismBlue, nimblismBlue],
      life: 20,
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    FAB_MANUAL_HARNESS,
  );
  const Olympia = game.as(olympia);
  const Bravo = game.as(bravo);
  Olympia.play(headsUpRed);
  game.untilIdle();
  Olympia.play(gutshotRed);
  game.untilIdle();
  Olympia.activate(goldenGrail);
  const order = game.advanceToDecision(Olympia, "ordering");
  const heads = order.entries.find((entry) =>
    entry.label.includes("triggeredAttackCompareAmountCountThisChainLink"),
  );
  const wager = order.entries.find((entry) => entry.label.includes("wagerOnAttack"));
  if (!heads || !wager) throw new Error("Expected Heads Up and Gutshot attack triggers");
  game.answerDecision(Olympia.id, { kind: "ordering", orderedIds: [heads.id, wager.id] });
  game.advanceUntil({ stopAt: "defend" });
  expectCombat(game).toHaveAttackPower(10);
  expect(Bravo.expectBlockRejected([nimblismBlue, nimblismBlue]).errorCode).toBe("dominate");
  Bravo.defendWith(nimblismBlue);
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(12);
  Olympia.endTurn();
  Bravo.endTurn();
  Olympia.play(gutshotBlue, { pitch: [nimblismBlue] });
  game.untilIdle();
  Olympia.activateAttack(goldenGrail, { alternativeCostIndex: 0 });
  expectCombat(game).toHaveAttackPower(5);
  Bravo.defendWith(nimblismBlue, nimblismBlue);
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(11);
});

it("a second wagered Sword does not inherit the first Sword's Heads Up dominate", () => {
  const game = FabTestEngine.start(
    {
      hero: olympia,
      weapon1: [cintariSaber],
      weapon2: [cintariSaber],
      hand: [headsUpRed, gutshotRed, gutshotBlue, hitAndRunBlue],
      resourcePoints: 5,
      actionPoints: 1,
      deck: [nimblismBlue, nimblismBlue],
    },
    {
      hero: bravo,
      hand: [nimblismBlue, nimblismBlue, nimblismBlue],
      life: 20,
      deck: [nimblismBlue, nimblismBlue],
    },
    FAB_MANUAL_HARNESS,
  );
  const Olympia = game.as(olympia);
  const Bravo = game.as(bravo);
  Olympia.play(headsUpRed);
  game.untilIdle();
  Olympia.play(gutshotRed);
  game.untilIdle();
  Olympia.play(hitAndRunBlue);
  game.untilIdle();
  Olympia.activate(cintariSaber, { index: 0 });
  const order = game.advanceToDecision(Olympia, "ordering");
  const heads = order.entries.find((entry) =>
    entry.label.includes("triggeredAttackCompareAmountCountThisChainLink"),
  );
  const wager = order.entries.find((entry) => entry.label.includes("wagerOnAttack"));
  if (!heads || !wager) throw new Error("Expected Heads Up and Gutshot attack triggers");
  game.answerDecision(Olympia.id, { kind: "ordering", orderedIds: [heads.id, wager.id] });
  game.advanceUntil({ stopAt: "defend" });
  expectCombat(game).toHaveAttackPower(8);
  expect(Bravo.expectBlockRejected([nimblismBlue, nimblismBlue]).errorCode).toBe("dominate");
  Bravo.defendWith(nimblismBlue);
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(14);
  Olympia.play(gutshotBlue);
  game.untilIdle();
  Olympia.activateAttack(cintariSaber, { index: 1 });
  expectCombat(game).toHaveAttackPower(3);
  Bravo.defendWith(nimblismBlue, nimblismBlue);
  game.closeCombat();
  expectFabPlayer(Bravo).toHaveLife(14).toHaveTokenCount("blade-dance", 1);
  expectFabPlayer(Olympia).toHaveTokenCount("blade-dance", 0);
});
