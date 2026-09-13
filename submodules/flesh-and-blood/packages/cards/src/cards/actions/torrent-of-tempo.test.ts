import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { torrentOfTempoRed } from "./torrent-of-tempo.ts";

/**
 * Torrent of Tempo, Red (IRA006) — Ninja Attack, cost 1, 5{p}.
 * Printed: When this hits, it gets go again.
 */

describe("Torrent of Tempo (IRA006) AAA", () => {
  it("happy: a hit grants go again and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [torrentOfTempoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(torrentOfTempoRed);
    game.closeCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabPlayer(Ira).toHaveAP(1);
  });

  it("boundary: a miss does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [torrentOfTempoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);
    const Bravo = game.as(bravo);

    Ira.playAttack(torrentOfTempoRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Ira).toHaveAP(0);
  });

  it("timing: go again refunds this attack only, not a later chain", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [torrentOfTempoRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(torrentOfTempoRed);
    game.closeCombat();
    expectFabPlayer(Ira).toHaveAP(1);

    Ira.playAttack(brutalAssaultBlue);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(Ira).toHaveAP(0);
  });
});
