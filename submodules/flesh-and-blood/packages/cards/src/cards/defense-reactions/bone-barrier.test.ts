import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "../actions/barnacle.ts";
import { boneBarrierBlue } from "./bone-barrier.ts";

/**
 * Bone Barrier (IAR093) — Necromancer Defense Reaction, cost 0, 2{d}.
 *
 * Printed: "When this defends, you may destroy an ally you control or
 * discard an ally. If you do, this gets +2{d}."
 */

describe("Bone Barrier (IAR093) AAA", () => {
  it("happy: discarding an ally gives the defending barrier +2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [boneBarrierBlue, barnacleYellow],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Gravy = game.as(gravyBones);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Gravy.defendWith();
    game.toReaction("defender");
    Gravy.must.playReaction(boneBarrierBlue);
    game.passBoth();
    game.passBoth(); // resolve the defend trigger up to the optional
    Gravy.accept();
    Gravy.choose("discard");
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 2 + 2 = 4{d} — fully blocked; the ally is discarded.
    expectFabPlayer(Gravy).toHaveLife(20);
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
    expectFabCard(Gravy, boneBarrierBlue).toBeIn("graveyard");
  });

  it("boundary: declining the optional keeps the printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [boneBarrierBlue, barnacleYellow],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Gravy = game.as(gravyBones);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Gravy.defendWith();
    game.toReaction("defender");
    Gravy.must.playReaction(boneBarrierBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 2{d} — 2 damage; the ally stays in hand.
    expectFabPlayer(Gravy).toHaveLife(18);
    expectFabCard(Gravy, barnacleYellow).toBeIn("hand");
  });
});
