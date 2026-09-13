import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { bravo } from "../heroes/bravo.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { snatchRed } from "../actions/snatch.ts";
import { heatWave } from "./heat-wave.ts";

/**
 * Heat Wave (FAI005) — Draconic Ninja Arms d0, Quell 1.
 *
 * Printed: "Instant - Destroy this: Phoenix Flames you control get +1{p}
 * until end of turn. Quell 1"
 */
describe("Heat Wave (FAI005) AAA", () => {
  it("happy: destroying Heat Wave boosts the attacking Phoenix Flame from 0 to 1{p}", () => {
    const game = FabTestEngine.start(
      { hero: fai, arms: [heatWave], hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Fai = game.as(fai);

    Fai.playAttack(phoenixFlameRed, { stopAt: "defend" });
    // Phoenix Flame Red is a 0{p} attack — the printed baseline.
    game.as(bravo).pass();
    Fai.activate(heatWave);
    game.closeCombat({ ordering: "listed" });

    // The 0{p} Flame connected as a 1{p} hit: 40 − 1.
    expectFabPlayer(game.as(bravo)).toHaveLife(39);
    // Destroy-self cost is paid: the arms leave the slot.
    expectFabCard(Fai, heatWave).toBeIn("graveyard");
  });

  it("boundary: a non-Phoenix-Flame attack is not boosted by the destroy", () => {
    const game = FabTestEngine.start(
      { hero: fai, arms: [heatWave], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed, { stopAt: "defend" });
    game.as(bravo).pass();
    Fai.activate(heatWave);
    game.closeCombat({ ordering: "listed" });

    // The moniker filter names Phoenix Flames only — snatch hits for its own 4.
    expectFabPlayer(game.as(bravo)).toHaveLife(36);
    expectFabCard(Fai, heatWave).toBeIn("graveyard");
  });
});
