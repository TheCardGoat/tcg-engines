import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "./barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { boardTheShipRed } from "./board-the-ship.ts";

/**
 * Board the Ship (SEA053) — Pirate Necromancer Action - Attack, cost 2, 6{p}.
 *
 * Printed: When this attacks, you may {t} an ally you control. If you do,
 * this gets overpower. Module also lists unprinted overpower (definition debt).
 */

describe("Board the Ship (SEA053) AAA", () => {
  it("happy: tapping a controlled ally when this attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [boardTheShipRed],
        arena: [barnacleYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(boardTheShipRed, { stopAt: "on-attack" });
    Gravy.accept();
    Gravy.target(barnacleYellow);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Gravy, barnacleYellow).toBeTapped();
    game.closeCombat();
  });

  it("boundary: with no ally, this still attacks at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [boardTheShipRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(boardTheShipRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
  });

  it("timing: declining the tap leaves the ally ready", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [boardTheShipRed],
        arena: [barnacleYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(boardTheShipRed, { stopAt: "on-attack" });
    Gravy.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Gravy, barnacleYellow).toBeReady();
    game.closeCombat();
  });
});
