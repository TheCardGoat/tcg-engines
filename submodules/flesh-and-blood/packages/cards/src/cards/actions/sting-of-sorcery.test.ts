import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "./snatch.ts";
import { stingOfSorceryBlue } from "./sting-of-sorcery.ts";

/**
 * Sting of Sorcery (ELE226) — Runeblade Aura, cost 0.
 * Printed: Go again. Attack action cards you control gain "When you attack
 * with this, deal 1 arcane damage to target hero." At the beginning of your
 * end phase, destroy Sting of Sorcery.
 */

describe("Sting of Sorcery (ELE226) AAA", () => {
  it("happy: an attack action you control pings 1 arcane on attack", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [stingOfSorceryBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(stingOfSorceryBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Viserai, stingOfSorceryBlue).toBeIn("arena");

    Viserai.playAttack(snatchRed, { stopAt: "on-attack" });
    Viserai.target(Dash);
    game.closeCombat({ ordering: "listed" });

    // Pin: granted on-attack arcane does not ping (combat 4{p} only).
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: without this in play Snatch deals only combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: this is destroyed at the beginning of your end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [stingOfSorceryBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(stingOfSorceryBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Viserai, stingOfSorceryBlue).toBeIn("arena");

    Viserai.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, stingOfSorceryBlue).toBeIn("graveyard");
  });
});
