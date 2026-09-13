import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { heavyIndustryRamStop } from "./heavy-industry-ram-stop.ts";

/**
 * Heavy Industry Ram Stop (AIO005) — Mechanologist Arms d1, Temper.
 *
 * Printed: "When this defends, you may pay {r}. If you do, it gets +1{d}
 * until end of turn. Temper"
 */
describe("Heavy Industry Ram Stop (AIO005) AAA", () => {
  it("happy: paying {r} on defend gets +1{d} on the link (4 − 2 = 2 damage)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [heavyIndustryRamStop], resourcePoints: 2, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(heavyIndustryRamStop);
    game.closeCombat({ optionals: "accept" });

    expectFabPlayer(Dash).toHaveLife(18); // snatch 4 − (1 printed + 1 paid)
    expectFabPlayer(Dash).toHaveResourceCount(1);
    // Temper's −1{d} plus the paid +1{d} keeps the piece seated.
    expectFabCard(Dash, heavyIndustryRamStop).toHaveDefenseCounters(-1);
    expectFabCard(Dash, heavyIndustryRamStop).toBeIn("arms");
  });

  it("boundary: declining the pay leaves printed {d} only — Temper destroys the d1 piece", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [heavyIndustryRamStop], resourcePoints: 2, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(heavyIndustryRamStop);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(17); // snatch 4 − 1
    expectFabPlayer(Dash).toHaveResourceCount(2); // nothing paid
    // d1 − 1 temper counter = 0{d} → destroyed (CR 8.3.10).
    expectFabCard(Dash, heavyIndustryRamStop).toBeIn("graveyard");
  });

  it("timing: 'when this defends' is subject-scoped — a hand-card co-defender never opens the pay", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [heavyIndustryRamStop],
        hand: [nimblismBlue],
        resourcePoints: 2,
        deck: 6,
      },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "accept" });

    // The trigger watched the arms piece, not the hand card — no pay happened.
    expectFabPlayer(Dash).toHaveResourceCount(2);
    expectFabCard(Dash, heavyIndustryRamStop).toBeIn("arms");
    expectFabPlayer(Dash).toHaveLife(18); // snatch 4 − nimblism 2
  });
});
