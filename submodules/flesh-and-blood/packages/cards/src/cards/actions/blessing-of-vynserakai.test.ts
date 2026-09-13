import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "./snatch.ts";
import { blessingOfVynserakaiRed } from "./blessing-of-vynserakai.ts";

describe("Blessing of Vynserakai (HNT163) AAA", () => {
  it("happy: next attack this turn is Draconic and gets +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: fai,
        arena: [blessingOfVynserakaiRed],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Fai, blessingOfVynserakaiRed).toBeIn("graveyard");

    Fai.playAttack(snatchRed);
    expectCombat(game).toHaveAttackSupertype("Draconic");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: an attack before your start phase is not granted Draconic or +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        arena: [blessingOfVynserakaiRed],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    expectCombat(game).notToHaveAttackSupertype("Draconic");
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fai, blessingOfVynserakaiRed).toBeIn("arena");
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: fai, arena: [blessingOfVynserakaiRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(fai).endTurn();
    game.untilIdle();
    expectFabCard(game.as(fai), blessingOfVynserakaiRed).toBeIn("arena");
  });
});
