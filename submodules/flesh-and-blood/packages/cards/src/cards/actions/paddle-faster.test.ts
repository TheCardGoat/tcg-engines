import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { paddleFasterRed } from "./paddle-faster.ts";

/**
 * Paddle Faster (AGB010) — Pirate Necromancer Action - Attack, cost 0, 4{p}/3{d}.
 *
 * Printed: "When this attacks, you may {t} an ally you control. If you do,
 * this gets go again."
 *
 * The module also lists unprinted `goAgain` on `keywords` (definition debt).
 * Pin the tap/if-you-do window; do not half-fix the keyword line here.
 */

describe("Paddle Faster (AGB010) AAA", () => {
  it("happy: tapping a controlled ally when this attacks grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [paddleFasterRed],
        arena: [barnacleYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(paddleFasterRed, { stopAt: "on-attack" });
    Gravy.accept();
    Gravy.target(barnacleYellow);
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Gravy, barnacleYellow).toBeTapped();
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, paddleFasterRed).toBeIn("graveyard");
  });

  it("boundary: with no ally, this still attacks at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [paddleFasterRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(paddleFasterRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: declining the tap leaves the ally ready", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [paddleFasterRed],
        arena: [barnacleYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(paddleFasterRed, { stopAt: "on-attack" });
    Gravy.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Gravy, barnacleYellow).toBeReady();
    game.closeCombat();
  });
});
