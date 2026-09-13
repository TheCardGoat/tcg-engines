import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { ridgeRiderShotRed } from "./ridge-rider-shot.ts";

/**
 * Ridge Rider Shot (ARC063) — Ranger Arrow Attack, cost 0, 4{p}/3{d}.
 *
 * Printed: "If Ridge Rider Shot is put into your arsenal face up, opt 1."
 */

describe("Ridge Rider Shot (ARC063) AAA", () => {
  it("happy: putting this into arsenal face up Opts 1 (looked card to the bottom)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [ridgeRiderShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        // Death Dealer draws the seated top; Opt 1 looks at the next card.
        deck: 6,
        deckTop: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(deathDealer);
    game.advanceToDecision(Azalea, "boolean");
    Azalea.accept();
    Azalea.target(ridgeRiderShotRed);
    const opt = game.advanceToDecision(Azalea, "partition");
    game.answerDecision(Azalea.id, {
      kind: "partition",
      groups: { top: [], bottom: opt.entries.map((entry) => entry.id) },
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Azalea, ridgeRiderShotRed).toBeIn("arsenal").toBeFaceUp();
    expect(Azalea.zone("deck")[0]).toBe(snatchRed.canonicalId);
  });

  it("boundary: putting this into arsenal face down does not Opt", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [ridgeRiderShotRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.endTurnWithArsenal(ridgeRiderShotRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Azalea, ridgeRiderShotRed).toBeIn("arsenal").toBeFaceDown();
    expect(Azalea.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
  });

  it("timing: from face-up arsenal this plays as a 4{p} arrow attack", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [],
        arsenal: [ridgeRiderShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    // playAttack throws on the unprinted opt(1) keyword; attackWith keeps looked cards on top.
    game.as(azalea).attackWith(ridgeRiderShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(4);
  });
});
