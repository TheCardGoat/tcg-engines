import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "./snatch.ts";
import { arcanicCunningRed } from "./arcanic-cunning.ts";

/**
 * Arcanic Cunning Red (OMN088) — Runeblade Action Attack, cost 0, 4{p}, 3{d}.
 *
 * Printed: While this is attacking, defending, or on the stack, if you would
 * be dealt arcane damage, prevent 1 of that damage.
 */

describe("Arcanic Cunning (OMN088) AAA", () => {
  it("attacks a hero for printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arcanicCunningRed],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Blaze = game.as(blazeFiremind);

    Viserai.playAttack(arcanicCunningRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Viserai, arcanicCunningRed).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveLife(16);
  });

  it("boundary: physical damage is not prevented while this is in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: viserai,
        hand: [arcanicCunningRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Viserai = game.as(viserai);

    Blaze.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Viserai, arcanicCunningRed).toBeIn("hand").toHaveDefense(3);
    expectFabPlayer(Viserai).toHaveLife(16);
    expectCombat(game).toBeClosed();
  });

  it("timing: printed 4{p} / 3{d} / cost 0 in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arcanicCunningRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(viserai), arcanicCunningRed)
      .toBeIn("hand")
      .toHavePower(4)
      .toHaveDefense(3)
      .toHaveCost(0);
  });
});
