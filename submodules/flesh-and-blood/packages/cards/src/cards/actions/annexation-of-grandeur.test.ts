import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { nimblismBlue } from "./nimblism.ts";
import { annexationOfGrandeurYellow } from "./annexation-of-grandeur.ts";

describe("Annexation of Grandeur (MPG030) AAA", () => {
  it("happy: 8 unblocked crush vs a Guardian steals their aura", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [annexationOfGrandeurYellow], resourcePoints: 5, deck: 6 },
      { hero: bravoShowstopper, arena: [spectralShield], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(bravoShowstopper);

    Attacker.attackWith(annexationOfGrandeurYellow);
    Defender.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Defender).toHaveLife(13);
    expect(Defender.zone("arena")).not.toContain(spectralShield.canonicalId);
  });

  it("boundary: 8{d} of blocks leaves 0 damage and the aura stays", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [annexationOfGrandeurYellow], resourcePoints: 5, deck: 6 },
      {
        hero: dash,
        arena: [spectralShield],
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(annexationOfGrandeurYellow);
    game.as(dash).defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expect(game.as(dash).zone("arena")).toContain(spectralShield.canonicalId);
  });

  it("timing: crush vs a non-Guardian still steals because the attack is Guardian", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [annexationOfGrandeurYellow], resourcePoints: 5, deck: 6 },
      { hero: dash, arena: [spectralShield], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(annexationOfGrandeurYellow);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expect(game.as(dash).zone("arena")).not.toContain(spectralShield.canonicalId);
  });
});
