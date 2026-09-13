import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { authorityOfAtayaBlue } from "./authority-of-ataya.ts";

function openReaction(attacker: ReturnType<FabTestEngine["as"]>, game: FabTestEngine): void {
  game.advanceCombatTo("reaction");
  attacker.pass();
}

describe("Authority of Ataya (SUP000) AAA", () => {
  it("happy: pitching this makes a printed-cost-0 defense reaction cost 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, authorityOfAtayaBlue],
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [sinkBelowRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(nimbleStrikeRed, { pitch: [authorityOfAtayaBlue] });
    game.passBoth();
    openReaction(Dash, game);
    Bravo.must.playReaction(sinkBelowRed);

    expectFabCard(Dash, authorityOfAtayaBlue).toBeIn("pitch");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: cannot be played, and without pitching this a cost-0 DR stays free", () => {
    const playGame = FabTestEngine.start(
      { hero: dash, hand: [authorityOfAtayaBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() => playGame.as(dash).play(authorityOfAtayaBlue)).toThrow();
    expectFabCard(playGame.as(dash), authorityOfAtayaBlue).toBeIn("hand");

    const taxed = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, authorityOfAtayaBlue],
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [sinkBelowRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    taxed.as(dash).play(nimbleStrikeRed, { pitch: [authorityOfAtayaBlue] });
    taxed.passBoth();
    openReaction(taxed.as(dash), taxed);
    expect(() => taxed.as(bravo).must.playReaction(sinkBelowRed)).toThrow();
    expectFabCard(taxed.as(bravo), sinkBelowRed).toBeIn("hand");

    const free = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [sinkBelowRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = free.as(dash);
    const Bravo = free.as(bravo);

    Dash.attackWith(snatchRed);
    openReaction(Dash, free);
    Bravo.must.playReaction(sinkBelowRed);

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expect(Bravo.zone("hand")).not.toContain(sinkBelowRed.canonicalId);
  });

  it("timing: the extra DR cost expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimbleStrikeRed, authorityOfAtayaBlue, snatchRed],
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [sinkBelowRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(nimbleStrikeRed, { pitch: [authorityOfAtayaBlue] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    Bravo.endTurn();

    Dash.attackWith(snatchRed);
    openReaction(Dash, game);
    Bravo.must.playReaction(sinkBelowRed);

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expect(Bravo.zone("hand")).not.toContain(sinkBelowRed.canonicalId);
  });
});
