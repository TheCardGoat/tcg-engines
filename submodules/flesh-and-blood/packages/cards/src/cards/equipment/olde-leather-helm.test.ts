import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { oldeLeatherHelm } from "./olde-leather-helm.ts";

/**
 * Olde Leather Helm (MPW140) — Generic Head d0, Blade Break.
 * Printed: "If you've been attacked 2 or more times this turn, this gets +2{d}."
 */

describe("Olde Leather Helm (MPW140) AAA", () => {
  it("happy: on the second attack of the turn the helm defends for 2, then Blade Breaks", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed, snatchYellow], actionPoints: 2, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [oldeLeatherHelm],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    // First attack of the turn — the helm has not unlocked yet, so Dash blocks
    // from hand to keep it equipped.
    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // Second attack — "attacked 2 or more times this turn" is now true.
    Fai.playAttack(snatchYellow);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(oldeLeatherHelm);
    expectFabCard(Dash, oldeLeatherHelm).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // 20 - (4-2) - (3-2)
    expectFabCard(Dash, oldeLeatherHelm).toBeIn("graveyard"); // Blade Break
  });

  it("boundary: on the first attack of the turn the helm keeps its printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [oldeLeatherHelm], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(oldeLeatherHelm);
    expectFabCard(Dash, oldeLeatherHelm).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
  });
});
