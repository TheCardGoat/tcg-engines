import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { sigilOfProtectionYellow } from "./sigil-of-protection.ts";
import { snatchRed } from "./snatch.ts";
import { astralEtchingsBlue, astralEtchingsRed } from "./astral-etchings.ts";

/**
 * Astral Etchings Red (MST134) — Illusionist Action.
 *
 * Printed: Put three +1{p} counters on target aura with ward you control.
 * If you control a Spectral Shield, you may play this as though it were an
 * instant. (yellow two, blue a single counter)
 */

describe("Astral Etchings (MST134) AAA", () => {
  it("method choice: may use ordinary action timing or the Spectral Shield instant grant", () => {
    const setup = () =>
      FabTestEngine.start(
        {
          hero: prism,
          hand: [astralEtchingsRed],
          arena: [sigilOfProtectionYellow, spectralShield],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, deck: 6 },
        FAB_MANUAL_HARNESS,
      );

    const ordinary = setup();
    ordinary.as(prism).must.play(astralEtchingsRed, {
      playPermission: "base",
      targetCard: sigilOfProtectionYellow,
    });
    expectFabPlayer(ordinary.as(prism)).toHaveAP(0);

    const granted = setup();
    granted.as(prism).must.play(astralEtchingsRed, {
      playPermission: "effect",
      targetCard: sigilOfProtectionYellow,
    });
    expectFabPlayer(granted.as(prism)).toHaveAP(1);
  });

  it("happy: puts three +1{p} counters on a controlled ward aura", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [astralEtchingsRed],
        arena: [sigilOfProtectionYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(astralEtchingsRed);
    game.passBoth();

    expectFabCard(Prism, sigilOfProtectionYellow).toHaveCounters(3);
    expectFabCard(Prism, astralEtchingsRed).toBeIn("graveyard");
  });

  it("boundary: cannot play without a ward aura to target", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [astralEtchingsRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    expect(() => Prism.play(astralEtchingsRed)).toThrow();
    expectFabCard(Prism, astralEtchingsRed).toBeIn("hand");
  });

  it("timing: with a Spectral Shield this can be played from arsenal on the opponent's attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        arsenal: [astralEtchingsRed],
        arena: [sigilOfProtectionYellow, spectralShield],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Prism = game.as(prism);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Prism.must.playFromArsenal(astralEtchingsRed);
    game.passBoth();

    expectFabCard(Prism, sigilOfProtectionYellow).toHaveCounters(3);
    expectFabCard(Prism, astralEtchingsRed).toBeIn("graveyard");
  });

  it("boundary: without a Spectral Shield it cannot be played from arsenal on the opponent's attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        arsenal: [astralEtchingsRed],
        arena: [sigilOfProtectionYellow],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Prism = game.as(prism);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();

    expectFabUnplayable(
      () => Prism.must.playFromArsenal(astralEtchingsRed),
      /action card is not legal in the current layer position/i,
    );
    expectFabCard(Prism, astralEtchingsRed).toBeIn("arsenal");
  });

  it("boundary: blue puts a single +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [astralEtchingsBlue],
        arena: [sigilOfProtectionYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(astralEtchingsBlue);
    game.passBoth();

    expectFabCard(Prism, sigilOfProtectionYellow).toHaveCounters(1);
    expectFabCard(Prism, astralEtchingsBlue).toBeIn("graveyard");
  });
});
