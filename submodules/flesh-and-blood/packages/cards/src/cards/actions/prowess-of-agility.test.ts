import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { prowessOfAgilityBlue } from "./prowess-of-agility.ts";

/**
 * Prowess of Agility (HNT073) — Ninja Action - Aura, cost 0.
 *
 * Printed: When you attack for the fourth time during a turn, you may destroy
 * this. If you do, draw a card.
 *
 * Filter uses has-status: fourth-attack-this-turn; producer landed
 * (attacksThisTurn fact), conversion parked on the drain quirk above.
 */

describe("Prowess of Agility (HNT073) AAA", () => {
  it("happy: the fourth attack this turn may destroy this to draw", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [prowessOfAgilityBlue, phoenixFlameRed, phoenixFlameRed, phoenixFlameRed, snatchRed],
        actionPoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(prowessOfAgilityBlue);
    game.helpers.resolveUntilIdle();
    for (const c of [phoenixFlameRed, phoenixFlameRed, phoenixFlameRed]) {
      Katsu.playAttack(c, { optionals: "accept" });
      game.closeCombat({ ordering: "listed", optionals: "decline" });
    }
    Katsu.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceToDecision(Katsu, "boolean");
    Katsu.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    game.closeCombat({ ordering: "listed", optionals: "decline" });

    expectFabCard(Katsu, prowessOfAgilityBlue).toBeIn("graveyard");
    expectFabPlayer(Katsu).toHaveHandCount(2); // Prowess draw + Snatch hit draw
  });

  it("boundary: the first attack this turn does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [prowessOfAgilityBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(prowessOfAgilityBlue);
    game.helpers.resolveUntilIdle();
    Katsu.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    expectFabCard(Katsu, prowessOfAgilityBlue).toBeIn("arena");
  });

  it("timing: end of a turn with fewer than 3 attacks still leaves this seated until the end-phase rider", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [prowessOfAgilityBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.play(prowessOfAgilityBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Katsu, prowessOfAgilityBlue).toBeIn("arena");
  });
});
