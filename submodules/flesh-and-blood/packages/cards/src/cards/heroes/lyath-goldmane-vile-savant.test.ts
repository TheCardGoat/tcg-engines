import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { disableRed } from "../actions/disable.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lyathGoldmaneVileSavant } from "./lyath-goldmane-vile-savant.ts";

/**
 * Lyath Goldmane, Vile Savant (SUP071) — Reviled Guardian Hero — 40hp.
 *
 * Printed: "The base {p} and {d} of cards you control are halved, rounded up.
 * Instant — {r}{r}, {t}: The crowd boos you. Defending action cards you control
 * get +1{d} this turn. Whenever the crowd boos you, create a Might token."
 *
 * Proves:
 * - Base {p} and {d} halved, rounded up (hand-zone cards included)
 * - Instant: pays {r}{r}, taps the hero, boos you, +1{d} on defending actions
 * - Any crowd boo creates a Might token; no boo creates none
 * - The rider lands during combat on a defending action card
 */

const _opponentHero = dash;

describe("Lyath Goldmane, Vile Savant (SUP071) AAA", () => {
  it("happy: base power and defense of cards you control are halved, rounded up", () => {
    const game = FabTestEngine.start(
      { hero: lyathGoldmaneVileSavant, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmaneVileSavant);

    // snatch-red: 4{p}/2{d} → halved to 2{p}/1{d}.
    expectFabCard(Lyath, snatchRed).toHavePower(2).toHaveDefense(1);
  });

  it("boundary: odd base stats round up (9{p}→5, 3{d}→2), not down", () => {
    const game = FabTestEngine.start(
      { hero: lyathGoldmaneVileSavant, hand: [disableRed], deck: 6 },
      { hero: dash, deck: 6 },
    );

    expectFabCard(game.as(lyathGoldmaneVileSavant), disableRed).toHavePower(5).toHaveDefense(2);
  });

  it("instant: pays {r}{r}, taps the hero, boos you, and creates a Might token", () => {
    const game = FabTestEngine.start(
      { hero: lyathGoldmaneVileSavant, resourcePoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmaneVileSavant);

    Lyath.activate(lyathGoldmaneVileSavant);

    expectFabPlayer(Lyath).toHaveResourceCount(0);
    expectFabCard(Lyath, lyathGoldmaneVileSavant).toBeTapped();
    expectFabPlayer(Lyath).toHaveCrowdBooedThisTurn();
    expectFabToken(game, "might").toHaveCount(1);
  });

  it("instant rider: a defending action card you control gets +1{d} this turn", () => {
    const game = FabTestEngine.start(
      { hero: lyathGoldmaneVileSavant, hand: [snatchRed], resourcePoints: 2, life: 40, deck: 6 },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Lyath = game.as(lyathGoldmaneVileSavant);

    // Dash attacks with 4{p} (his snatch is not Lyath's card — not halved).
    Dash.playAttack(snatchRed);
    // Lyath defends with his own snatch: 2{d} halved to 1{d}.
    Lyath.defendWith(snatchRed);
    // Reaction step: pay {r}{r},{t} — the defending action gains +1{d} → 2{d}.
    Lyath.activate(lyathGoldmaneVileSavant);
    expectFabCard(Lyath, snatchRed).toBeIn("combatChain").toHaveDefense(2);
    game.passBoth();

    expectCombat(game).toBeClosed();
    // 4{p} − 2{d} = 2 damage.
    expectFabPlayer(Lyath).toHaveLife(38);
    expectFabToken(game, "might").toHaveCount(1);
  });

  it("boundary: without a crowd-boo event, no Might token is created", () => {
    const game = FabTestEngine.start(
      { hero: lyathGoldmaneVileSavant, deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Lyath = game.as(lyathGoldmaneVileSavant);

    expectFabPlayer(Lyath).notToHaveCrowdBooedThisTurn();
    expectFabToken(game, "might").toHaveCount(0);
  });
});
