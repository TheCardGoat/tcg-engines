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
import { manOverboardRed } from "./man-overboard.ts";

/**
 * Man Overboard (PEN159) — Pirate Necromancer Action - Attack, cost 0, 3{p}.
 *
 * Printed: When this attacks, you may discard an ally. If you do, this gets
 * +1{p} and go again. Module also lists unprinted goAgain (definition debt).
 */

describe("Man Overboard family AAA", () => {
  it("happy: discarding an ally grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [manOverboardRed, barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(manOverboardRed, { stopAt: "on-attack" });
    Gravy.accept();
    Gravy.target(barnacleYellow);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
  });

  it("boundary: with no ally, power stays printed 3", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [manOverboardRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(manOverboardRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
  });

  it("timing: declining the discard keeps the ally in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [manOverboardRed, barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(manOverboardRed, { stopAt: "on-attack" });
    Gravy.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabCard(Gravy, barnacleYellow).toBeIn("hand");
  });
});
