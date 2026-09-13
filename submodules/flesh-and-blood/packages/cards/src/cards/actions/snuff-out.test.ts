import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { bravo } from "../heroes/bravo.ts";
import { maleficIncantationBlue } from "./malefic-incantation.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { snuffOutRed } from "./snuff-out.ts";

/**
 * Snuff Out, Red (ROS117) — Runeblade Attack, cost 1, 5{p}.
 * Printed: "When this hits a hero, you may destroy an aura you control.
 * If you do, they discard a card."
 */

describe("Snuff Out (ROS117) AAA", () => {
  it("happy: a hero-hit may destroy a controlled aura then they discard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [snuffOutRed],
        arena: [maleficIncantationBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
    );
    const Viserai = game.as(viserai);
    const Bravo = game.as(bravo);

    Viserai.playAttack(snuffOutRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Viserai, maleficIncantationBlue).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not destroy the aura or force a discard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [snuffOutRed],
        arena: [maleficIncantationBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Viserai = game.as(viserai);
    const Bravo = game.as(bravo);

    Viserai.playAttack(snuffOutRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Viserai, maleficIncantationBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining the optional leaves the aura and their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [snuffOutRed],
        arena: [maleficIncantationBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
    );
    const Viserai = game.as(viserai);
    const Bravo = game.as(bravo);

    Viserai.playAttack(snuffOutRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Viserai, maleficIncantationBlue).toBeIn("arena");
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
  });
});
