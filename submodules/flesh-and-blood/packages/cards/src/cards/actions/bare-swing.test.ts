import { describe, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { beastModeRed } from "./beast-mode.ts";
import { barkboneStrapping } from "../equipment/barkbone-strapping.ts";
import { bareSwingRed } from "./bare-swing.ts";
import { bareSwingYellow } from "./bare-swing.ts";

describe("Bare Swing (ARR009) AAA", () => {
  it("happy: beaten chest with no chest equipment grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareSwingRed, beastModeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.playAttack(bareSwingRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: skipping beat chest leaves printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareSwingRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(rhinar).playAttack(bareSwingRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: chest equipment blocks the beaten-chest +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareSwingRed, beastModeRed],
        chest: [barkboneStrapping],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.playAttack(bareSwingRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    expectCombat(game).toHaveAttackPower(7);
  });
});

describe("Bare Swing (ARR017) AAA", () => {
  it("happy: beaten chest with no chest equipment grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareSwingYellow, beastModeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.playAttack(bareSwingYellow, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: skipping beat chest leaves printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareSwingYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(rhinar).playAttack(bareSwingYellow);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: chest equipment blocks the beaten-chest +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareSwingYellow, beastModeRed],
        chest: [barkboneStrapping],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.playAttack(bareSwingYellow, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    expectCombat(game).toHaveAttackPower(6);
  });
});
