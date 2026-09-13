import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { takeAimRed } from "./take-aim.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { boltNShotRed } from "./bolt-n-shot.ts";

// bolt-n-shot-red (ELE216) — Ranger Arrow Attack, cost 0, power 4.
// Printed: "If Bolt'n' Shot's {p} is greater than its base {p}, it has go again
// and \"If this hits, reload.\""
describe("bolt-n-shot-red (ELE216) AAA", () => {
  it("happy: extra power grants hit-reload of a hand card into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [takeAimRed, nimblismBlue],
        arsenal: [boltNShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(takeAimRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.attackWith(boltNShotRed, { from: "arsenal" });
    // Base 4 + 3 from Take Aim = 7 > base → "If this hits, reload."
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(Azalea.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    expect(game.objectState(Azalea.findCardInZone("arsenal", nimblismBlue)).faceDown).toBe(true);
  });

  it("boundary: at printed power a hit does NOT reload", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [nimblismBlue],
        arsenal: [boltNShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(boltNShotRed, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Azalea.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });

  it("timing: extra power grants go again on the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [takeAimRed],
        arsenal: [boltNShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(takeAimRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Azalea.actionPoints()).toBe(1);
    Azalea.attackWith(boltNShotRed, { from: "arsenal" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // Take Aim refunded its AP; Bolt 'n' Shot's granted go again refunds the attack.
    expect(Azalea.actionPoints()).toBe(1);
  });
});
