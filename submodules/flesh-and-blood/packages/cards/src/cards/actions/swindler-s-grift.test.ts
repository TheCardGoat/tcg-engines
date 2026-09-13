import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { headShotYellow } from "../shared/test-recipients.ts";
import { swindlerSGriftRed } from "./swindler-s-grift.ts";

/**
 * Swindler's Grift (SEA169) — Pirate Action - Attack, cost 2, 6{p}.
 *
 * Printed: When this attacks, you may discard a yellow card. If you do, draw
 * a card and create a Gold token.
 */

describe("Swindler's Grift family AAA", () => {
  it("happy: discarding a yellow card draws and creates Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [swindlerSGriftRed, headShotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(swindlerSGriftRed, { stopAt: "on-attack" });
    Gravy.accept();
    Gravy.target(headShotYellow);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 1).toHaveHandCount(1);
    expectFabCard(Gravy, headShotYellow).toBeIn("graveyard");
  });

  it("boundary: with no yellow card, no Gold is created", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [swindlerSGriftRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(swindlerSGriftRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });

  it("timing: declining the discard creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [swindlerSGriftRed, headShotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(swindlerSGriftRed, { stopAt: "on-attack" });
    Gravy.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Gravy, headShotYellow).toBeIn("hand");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });
});
