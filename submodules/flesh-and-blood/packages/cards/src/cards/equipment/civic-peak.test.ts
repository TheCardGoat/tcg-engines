import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { civicPeak } from "./civic-peak.ts";

/**
 * Civic Peak — Guardian Head d2, Temper.
 * Printed: "Whenever this defends, another target hero draws a card. Temper"
 * In 1v1 the "another target hero" is the attacking opponent.
 */

describe("Civic Peak AAA", () => {
  it("happy: defending draws the attacker a card and Temper scars the peak", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, head: [civicPeak], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(civicPeak);
    game.closeCombat({ ordering: "listed" });

    // Snatch's own hit draw plus Civic Peak's draw.
    expectFabPlayer(Dash).toHaveHandCount(2);
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, civicPeak).toBeIn("head");
    expectFabCard(Bravo, civicPeak).toHaveDefenseCounters(-1);
  });

  it("boundary: without defending, the peak draws nobody and takes the full hit", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, head: [civicPeak], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, civicPeak).toHaveDefenseCounters(0);
  });
});
