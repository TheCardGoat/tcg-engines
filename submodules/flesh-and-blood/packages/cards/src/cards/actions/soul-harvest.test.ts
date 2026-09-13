import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { gravelingGrowlBlue } from "./graveling-growl.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { soulHarvestBlue } from "./soul-harvest.ts";

const gy = [
  gravelingGrowlBlue,
  gravelingGrowlBlue,
  gravelingGrowlBlue,
  gravelingGrowlBlue,
  gravelingGrowlBlue,
  gravelingGrowlBlue,
];

describe("Soul Harvest (LEV008) AAA", () => {
  it("happy: a hit banishes their soul and they lose that much {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [soulHarvestBlue],
        graveyard: gy,
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, soul: [snatchRed, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(soulHarvestBlue);
    // PIN: additional-cost blood-debt banish does not add +1{p} per card banished this way.
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: a miss does not banish their soul", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [soulHarvestBlue],
        graveyard: gy,
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        soul: [snatchRed, snatchRed],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(soulHarvestBlue);
    Dash.defendWith(
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
      nimblismBlue,
    );
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("soul")).toHaveLength(2);
  });
});
