import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { jollyBludgerYellow } from "./jolly-bludger.ts";

/**
 * Jolly Bludger (SEA005) — Pirate Mechanologist Action - Attack, cost 2, 5{p}.
 *
 * Printed: When this attacks, you may {t} a cog you control. If you do, this
 * gets overpower. Module also lists unprinted overpower (definition debt).
 */

describe("Jolly Bludger (SEA005) AAA", () => {
  it("happy: tapping a cog when this attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [jollyBludgerYellow],
        arena: [goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(jollyBludgerYellow, { stopAt: "on-attack" });
    Gravy.accept();
    Gravy.target(goldenCog);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Gravy, goldenCog).toBeTapped();
    game.closeCombat();
  });

  it("boundary: with no cog, this still attacks at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [jollyBludgerYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(jollyBludgerYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });

  it("timing: declining the tap leaves the cog ready", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [jollyBludgerYellow],
        arena: [goldenCog],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(jollyBludgerYellow, { stopAt: "on-attack" });
    Gravy.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Gravy, goldenCog).toBeReady();
    game.closeCombat();
  });
});
