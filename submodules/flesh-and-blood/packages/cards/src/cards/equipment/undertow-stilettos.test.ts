import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nuu } from "../heroes/nuu.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { undertowStilettos } from "./undertow-stilettos.ts";

/**
 * Undertow Stilettos (MST007) — Mystic Assassin Legs d1 Battleworn.
 *
 * Printed: Attack Reaction - {r}, destroy this: Create a Slither in your hand.
 */

describe("Undertow Stilettos (MST007) AAA", () => {
  it("happy: Attack Reaction destroy puts a Slither into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        legs: [undertowStilettos],
        hand: [brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Nuu.activate(undertowStilettos);
    game.passBoth();

    expectFabCard(Nuu, undertowStilettos).toBeIn("graveyard");
    expect(Nuu.zone("hand")).toContain("token:slither");
    expectFabPlayer(Nuu).toHaveTokenCount("slither", 0);
  });

  it("boundary: 0 resources cannot pay the Attack Reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        legs: [undertowStilettos],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Nuu.expectActivationRejected(undertowStilettos);
    expectFabCard(Nuu, undertowStilettos).toBeIn("legs");
  });

  it("timing: the Attack Reaction is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        legs: [undertowStilettos],
        hand: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.expectActivationRejected(undertowStilettos);
    expectFabCard(Nuu, undertowStilettos).toBeIn("legs");
    expect(Nuu.zone("hand")).not.toContain("token:slither");
  });
});
