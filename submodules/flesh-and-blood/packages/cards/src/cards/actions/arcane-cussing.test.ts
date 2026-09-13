import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { arcaneCussingRed } from "./arcane-cussing.ts";

/**
 * Arcane Cussing (FLR012) — Runeblade Action Aura.
 *
 * Printed: Go again
 *          When you deal or are dealt damage, destroy this.
 *          When this leaves the arena during your turn, create 3 Runechant
 *          tokens.
 */

describe("arcaneCussing family AAA", () => {
  it("happy: dealing damage on your turn destroys this and creates 3 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arcaneCussingRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(arcaneCussingRed);
    game.passBoth();
    Viserai.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Viserai, arcaneCussingRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: the aura stays in arena until damage is dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arcaneCussingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(arcaneCussingRed);
    game.passBoth();

    expectFabCard(Viserai, arcaneCussingRed).toBeIn("arena");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  });
});
