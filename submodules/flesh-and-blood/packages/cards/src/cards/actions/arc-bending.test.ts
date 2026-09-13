import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { arcBendingRed } from "./arc-bending.ts";

describe("Arc Bending (PEN202) AAA", () => {
  it("happy: unblocked 5{p} amps itself to 6; no Lightning pitch means no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: arcBendingRed, state: { faceDown: false } }],
        hand: [brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(arcBendingRed, { from: "arsenal" });
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat();

    // Arc Bending is itself an Elemental attack, so its own damage is amped.
    expectFabPlayer(game.as(dash)).toHaveLife(14); // 20 - (5 + 1)
    expect(Azalea.actionPoints()).toBe(0);
  });

  it("boundary: a Generic next attack is not plus-1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: arcBendingRed, state: { faceDown: false } }],
        hand: [brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(arcBendingRed, { from: "arsenal" });
    game.closeCombat();
    Azalea.playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(10); // 14 - 4, printed power only
  });

  it("timing: Lightning Bond still refunds AP when a Lightning card is pitched", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: arcBendingRed, state: { faceDown: false } }],
        hand: [weaveLightningRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(arcBendingRed, { from: "arsenal", pitch: [weaveLightningRed] });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expect(Azalea.actionPoints()).toBe(1);
  });
});
