import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { snatchRed } from "./snatch.ts";
import { goonTacticsBlue } from "./goon-tactics.ts";

describe("Goon Tactics (SUP106) AAA", () => {
  it("happy: three auras make this 4{p} and destroy their deck-top on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield, spectralShield],
        hand: [goonTacticsBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(bravo).playAttack(goonTacticsBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
  });

  it("boundary: two auras keep this at 1{p} and leave their deck intact", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield],
        hand: [goonTacticsBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(bravo).playAttack(goonTacticsBlue);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: a miss with three auras does not destroy their deck-top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield, spectralShield],
        hand: [goonTacticsBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [goonTacticsBlue, goonTacticsBlue],
        deckTop: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.as(bravo).playAttack(goonTacticsBlue);
    Dash.defendWith([goonTacticsBlue, goonTacticsBlue]);
    game.closeCombat();
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });
});
