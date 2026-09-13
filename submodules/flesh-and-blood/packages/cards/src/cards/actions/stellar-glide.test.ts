import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { stellarGlideRed } from "./stellar-glide.ts";

/**
 * Stellar Glide (OMN175) — Lightning Action - Attack, cost 2, 5{p}.
 *
 * Printed: When this attacks, you may destroy a Lightning Flow you control.
 * If you do, this gets go again.
 * Module also lists unprinted goAgain on keywords (definition debt).
 */

describe("Stellar Glide (OMN175) AAA", () => {
  it("happy: destroying a Lightning Flow when this attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stellarGlideRed],
        arena: [lightningFlow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(stellarGlideRed, { stopAt: "on-attack" });
    Briar.accept();
    Briar.target(lightningFlow);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 0);
  });

  it("boundary: with no Lightning Flow this still attacks at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stellarGlideRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(stellarGlideRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });

  it("timing: declining the destroy leaves the Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stellarGlideRed],
        arena: [lightningFlow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(stellarGlideRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });
});
