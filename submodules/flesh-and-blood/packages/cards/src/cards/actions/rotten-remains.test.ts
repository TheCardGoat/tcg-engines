import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { yintiYantiBlue } from "./yinti-yanti.ts";
import { browbeatBlue } from "./browbeat.ts";
import { rottenRemainsBlue } from "./rotten-remains.ts";

/**
 * Rotten Remains (HNT221) — Generic Attack Action, 1{p}.
 * Printed: When this attacks, you may banish a card with 1{p} from each hero's
 * graveyard. If you do, this gets +1{p}, then repeat this process.
 */

describe("Rotten Remains (HNT221) AAA", () => {
  it("happy: banishing 1{p} from each graveyard gives +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        graveyard: [yintiYantiBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], graveyard: [browbeatBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    Dash.accept();
    Dash.decline();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, yintiYantiBlue).toBeBanished();
    expectFabCard(game.as(bravo), browbeatBlue).toBeBanished();
  });

  it("boundary: empty graveyards leave printed 1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rottenRemainsBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: declining the banish leaves printed 1{p} on this attack only", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        graveyard: [yintiYantiBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], graveyard: [browbeatBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    Dash.decline();
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Dash, yintiYantiBlue).toBeIn("graveyard");
  });
});
