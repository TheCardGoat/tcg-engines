import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mordredTideRed } from "../actions/mordred-tide.ts";
import { corruptedCrown } from "./corrupted-crown.ts";

/**
 * Corrupted Crown — Shadow Head d1, Blade Break.
 * Printed: "When this defends, you may banish a card from your hand. If you
 * do, this gets +1{d}. Blade Break"
 */

describe("Corrupted Crown AAA", () => {
  it("happy: banishing from hand buys +1{d} on the chain link", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, head: [corruptedCrown], hand: [mordredTideRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).playAttack(snatchRed);
    Viserai.defendWith(corruptedCrown);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    // 4{p} versus 1{d} + the purchased 1{d}.
    expectFabPlayer(Viserai).toHaveLife(18);
    expectFabCard(Viserai, corruptedCrown).toBeIn("graveyard");
    expectFabCard(Viserai, mordredTideRed).toBeBanished();
  });

  it("boundary: declining the banish keeps the hand but takes 3 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, head: [corruptedCrown], hand: [mordredTideRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).playAttack(snatchRed);
    Viserai.defendWith(corruptedCrown);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Viserai).toHaveLife(17);
    expectFabCard(Viserai, mordredTideRed).toBeIn("hand");
    // Blade Break still claims the crown after it defended.
    expectFabCard(Viserai, corruptedCrown).toBeIn("graveyard");
  });
});
