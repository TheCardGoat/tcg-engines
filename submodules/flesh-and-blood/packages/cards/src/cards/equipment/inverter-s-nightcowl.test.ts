import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { uzuri } from "../heroes/uzuri.ts";
import { dash } from "../heroes/dash.ts";
import { creepRed } from "../actions/creep.ts";
import { kissOfDeathRed } from "../actions/kiss-of-death.ts";
import { snatchRed } from "../actions/snatch.ts";
import { inverterSNightcowl } from "./inverter-s-nightcowl.ts";

/**
 * Inverter's Nightcowl (AAC005) — Assassin Chest d1 Battleworn.
 *
 * Printed: "Action - Destroy this: Until end of turn, whenever you play a card
 * with stealth, gain {r}. Go again. Battleworn"
 */

describe("Inverter's Nightcowl (AAC005) AAA", () => {
  it("happy: destroying the cowl turns every stealth card played this turn into +1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        chest: [inverterSNightcowl],
        hand: [creepRed, kissOfDeathRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.activate(inverterSNightcowl);
    game.untilIdle();

    // Action activation is refunded by the printed go again (2 - 1 + 1).
    expectFabPlayer(Uzuri).toHaveAP(2);
    expectFabCard(Uzuri, inverterSNightcowl).toBeIn("graveyard");

    Uzuri.playAttack(creepRed);
    expectFabPlayer(Uzuri).toHaveResourceCount(1);

    game.advanceUntil({ stopAt: "resolution" });
    Uzuri.playAttack(kissOfDeathRed);
    // Windowed trigger keeps firing for every stealth card this turn.
    expectFabPlayer(Uzuri).toHaveResourceCount(2);

    game.closeCombat({ ordering: "listed" });
  });

  it("boundary: a non-stealth attack action gains no resources", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        chest: [inverterSNightcowl],
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.activate(inverterSNightcowl);
    game.untilIdle();

    Uzuri.playAttack(snatchRed);
    expectFabPlayer(Uzuri).toHaveResourceCount(0);
    game.closeCombat({ ordering: "listed" });
  });

  it("timing: the window closes at end of turn — no gains next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        chest: [inverterSNightcowl],
        hand: [creepRed, kissOfDeathRed],
        actionPoints: 3,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.activate(inverterSNightcowl);
    game.untilIdle();
    Uzuri.playAttack(creepRed);
    game.closeCombat({ ordering: "listed" });
    Uzuri.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Uzuri.playAttack(kissOfDeathRed);
    expectFabPlayer(Uzuri).toHaveResourceCount(0);
    game.closeCombat({ ordering: "listed" });
  });
});
