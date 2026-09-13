import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { uzuri } from "../heroes/uzuri.ts";
import { dash } from "../heroes/dash.ts";
import { toxicTips } from "./toxic-tips.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Toxic Tips (ARA005) — Assassin / Ranger Equipment - Arms, Blade Break.
 *
 * Printed: "Action - {r}, destroy Toxic Tips: The next attack action card you
 * play this turn gains 'When this hits a hero, create a Frailty, Inertia, or
 * Bloodrot Pox token under their control.' Go again"
 */
describe("Toxic Tips (ARA005) AAA", () => {
  it("happy: the latched attack hits and mints the chosen token under the defender's control", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        arms: [toxicTips],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    // Action - {r}, destroy this, go again.
    Uzuri.activate(toxicTips);
    game.helpers.resolveUntilIdle();
    expectFabCard(Uzuri, toxicTips).toBeIn("graveyard");
    expectFabPlayer(Uzuri).toHaveAP(2);

    Uzuri.must.playAttack(snatchRed);
    // Drain the defense window; the hit opens the two simultaneous triggers.
    for (let i = 0; i < 5 && !game.pendingDecision(); i += 1) {
      game.passBoth();
    }
    // Snatch's own draw and the granted token trigger are simultaneous.
    Uzuri.chooseListedOrder();
    // The granted hit trigger then asks which token to mint.
    for (let i = 0; i < 5 && !game.pendingDecision(); i += 1) {
      game.passBoth();
    }
    Uzuri.choose("frailty");
    game.helpers.resolveUntilIdle();

    // The token is created under the defending hero's control.
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
    expectFabPlayer(Uzuri).toHaveTokenCount("frailty", 0);
    // Snatch's own hit draw still happened.
    expectFabPlayer(Uzuri).toHaveHandCount(1);
  });

  it("boundary: an attack that hits without the latch mints no token", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        arms: [toxicTips],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.must.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 0);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
    // The arms were never destroyed — the latch was never armed.
    expectFabCard(Uzuri, toxicTips).toBeIn("arms");
  });
});
