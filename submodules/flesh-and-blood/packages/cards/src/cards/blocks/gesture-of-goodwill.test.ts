import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gestureOfGoodwillBlue } from "./gesture-of-goodwill.ts";

/**
 * Gesture of Goodwill (LGS361) — Generic Block, 3{d}, Protect.
 *
 * Printed: "Protect
 * When this protects another hero, they may give you a token they control."
 *
 * The Protect leg needs a third hero to protect and is out of scope for the
 * 1v1-only product (recorded as gap additional-hero-protect-1v1). This suite
 * proves the printed 3{d} defense through play.
 */

describe("Gesture of Goodwill (LGS361) AAA", () => {
  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: kassai, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [gestureOfGoodwillBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(gestureOfGoodwillBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(19); // 4 vs 3{d}
    expectFabCard(Dash, gestureOfGoodwillBlue).toBeIn("graveyard");
  });
});
