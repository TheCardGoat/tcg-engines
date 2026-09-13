import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { katsu } from "../heroes/katsu.ts";
import { nimblismBlue } from "./nimblism.ts";
import { roninRenegadeBlue } from "./ronin-renegade.ts";
import { snatchRed } from "./snatch.ts";
import { takeTheTempoRed } from "./take-the-tempo.ts";

/**
 * Take the Tempo (UPR161) — on hit, if you've hit 3+ times this chain, banish top
 * and you may play an AAC until end of your next turn.
 */

describe("Take the Tempo (UPR161) AAA", () => {
  it("happy: a first-chain hit does not banish (printed rider needs 3 hits this chain)", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [takeTheTempoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(takeTheTempoRed);
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Katsu.cardsIn("deck", snatchRed).length).toBeGreaterThan(0);
  });

  it("boundary: a miss does not banish the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [takeTheTempoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(takeTheTempoRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Katsu.cardsIn("deck", snatchRed).length).toBeGreaterThan(0);
  });

  it("timing: after 3 earlier hits this chain, banishes the top attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeBlue, roninRenegadeBlue, roninRenegadeBlue, takeTheTempoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(takeTheTempoRed);
    game.untilIdle({ ordering: "listed", optionals: "accept" });

    expect(Fai.zone("banished")).toContain(snatchRed.canonicalId);
  });
});
