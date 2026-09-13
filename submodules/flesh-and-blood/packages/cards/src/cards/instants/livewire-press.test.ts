import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { heavenSClawsBlue } from "../actions/heaven-s-claws.ts";
import { snatchRed } from "../actions/snatch.ts";
import { livewirePressRed } from "./livewire-press.ts";

/**
 * Livewire Press (OMN159) — target Lightning AAC gains on-hit deal 4.
 */

describe("Livewire Press (OMN159) AAA", () => {
  it("happy: target Lightning AAC deals 4 extra on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [heavenSClawsBlue, livewirePressRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(heavenSClawsBlue);
    game.advanceCombatTo("reaction");
    Briar.must.playInstant(livewirePressRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: a Generic attack is not a legal Lightning AAC target", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [snatchRed, livewirePressRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Briar.must.playInstant(livewirePressRed)).toThrow(
      /no legal target|couldn't be played|not legal/i,
    );
  });

  it("boundary: cannot play without an attack on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [livewirePressRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    expect(() => Briar.must.playInstant(livewirePressRed)).toThrow(
      /no legal target|couldn't be played|not legal/i,
    );
  });
});
