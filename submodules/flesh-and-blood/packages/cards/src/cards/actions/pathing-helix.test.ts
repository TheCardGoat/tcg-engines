import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pathingHelixRed } from "./pathing-helix.ts";

/**
 * Pathing Helix, Red (CRU129) — Ranger Arrow Attack, cost 0, 4{p}.
 * Printed: "If Pathing Helix hits and you have no cards in your arsenal,
 * you may put a card from your hand face down into your arsenal."
 */

describe("Pathing Helix (CRU129) AAA", () => {
  it("happy: a hit with empty arsenal may load a hand card face down", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [nimblismBlue],
        arsenal: [{ card: pathingHelixRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(pathingHelixRed, { from: "arsenal" });
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Azalea.target(nimblismBlue);

    expectFabCard(Azalea, nimblismBlue).toBeIn("arsenal");
    expect(Azalea.zone("arsenal")).toHaveLength(1);
  });

  it("boundary: occupied arsenal does not load a second card on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [nimblismBlue],
        arsenal: [{ card: pathingHelixRed, state: { faceDown: false } }, brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(pathingHelixRed, { from: "arsenal" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, nimblismBlue).toBeIn("hand");
    expectFabCard(Azalea, brutalAssaultBlue).toBeIn("arsenal");
  });

  it("timing: a miss with empty arsenal does not load from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [nimblismBlue],
        arsenal: [{ card: pathingHelixRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(pathingHelixRed, { from: "arsenal" });
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });
});
