import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { throttleRed } from "../actions/throttle.ts";
import { heavyIndustrySurveillance } from "./heavy-industry-surveillance.ts";

/**
 * Heavy Industry Surveillance (AIO003) — Mechanologist Head d1, Temper.
 *
 * Printed: "When this defends, you may banish the top card of your deck. If
 * it's a Mechanologist card, this gets +1{d} until end of turn. Temper"
 */
describe("Heavy Industry Surveillance (AIO003) AAA", () => {
  it("happy: banishing a Mechanologist top card gets +1{d} on the link (4 − 2 = 2 damage)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [heavyIndustrySurveillance], deckTop: [throttleRed], deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(heavyIndustrySurveillance);
    game.closeCombat({ optionals: "accept" });

    // Mechanologist banish → 1 printed + 1 buff = 2{d} on this link.
    expectFabPlayer(Dash).toHaveLife(18);
    expect(Dash.zone("banished")).toContain(throttleRed.canonicalId);
    expect(Dash.zone("deck")).not.toContain(throttleRed.canonicalId);
    // Temper −1{d} with the +1{d} buff live: the head piece survives.
    expectFabCard(Dash, heavyIndustrySurveillance).toBeIn("head");
  });

  it("boundary: a non-Mechanologist banish grants no buff (4 − 1 = 3 damage)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [heavyIndustrySurveillance], deckTop: [snatchRed], deck: 6 },
    );
    const Dash = game.as(dash);

    // A second snatch instance in the defender's deck top — the banish eats it.
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(heavyIndustrySurveillance);
    game.closeCombat({ optionals: "accept" });

    expectFabPlayer(Dash).toHaveLife(17); // printed 1{d} only
    expect(Dash.zone("banished")).toContain(snatchRed.canonicalId);
    // d1 + temper −1 → the head piece is destroyed without the buff.
    expectFabCard(Dash, heavyIndustrySurveillance).toBeIn("graveyard");
  });
});
