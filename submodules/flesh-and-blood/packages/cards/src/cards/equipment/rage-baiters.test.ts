import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { backStabRed } from "../actions/back-stab.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rageBaiters } from "./rage-baiters.ts";

/**
 * Rage Baiters (AAC006) — Assassin Arms d1, Blade Break.
 * Printed: "Attack Reaction - {r}, {t}: Target attack with stealth gets 'When
 * this hits a hero, mark them.'"
 */

describe("Rage Baiters (AAC006) AAA", () => {
  it("happy: the stealth attack hits and the granted trigger marks the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        arms: [rageBaiters],
        hand: [backStabRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(backStabRed);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.toReaction("attacker");
    Uzuri.activate(rageBaiters);
    Uzuri.target(backStabRed);

    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toBeMarked();
    expectFabPlayer(game.as(dash)).toHaveLife(17); // 20 - 3
    expectFabPlayer(Uzuri).toHaveResourceCount(0); // paid the {r}
  });

  it("boundary: an attack without stealth cannot be targeted by the reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        arms: [rageBaiters],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.toReaction("attacker");

    Uzuri.expectActivationRejected(rageBaiters);
    expectFabCard(Uzuri, rageBaiters).toBeIn("arms");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).notToBeMarked();
  });
});
