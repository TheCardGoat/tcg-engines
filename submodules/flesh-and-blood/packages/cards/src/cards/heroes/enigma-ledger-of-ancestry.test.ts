import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { enigmaLedgerOfAncestry } from "./enigma-ledger-of-ancestry.ts";
import { cosmoScrollOfAncestralTapestry } from "../weapons/cosmo-scroll-of-ancestral-tapestry.ts";

/**
 * Enigma, Ledger of Ancestry (HER114) — Mystic Illusionist Hero.
 *
 * Printed: Your first Spectral Shield attack each turn costs {r} less to
 * activate. Once per Turn Instant - {c}{c}{c}: Create a Spectral Shield token
 * with a +1{p} counter.
 */

describe("Enigma, Ledger of Ancestry (HER114) AAA", () => {
  it("happy: {c}{c}{c} creates a Spectral Shield token with a +1{p} counter", () => {
    const game = FabTestEngine.start(
      { hero: enigmaLedgerOfAncestry, chiPoints: 3, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.activate(enigmaLedgerOfAncestry);
    game.passBoth();

    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 1);
    expectFabPlayer(Enigma).toHaveLife(40);
  });

  it("boundary: the Instant is illegal with 0 chi, and a second activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: enigmaLedgerOfAncestry, chiPoints: 6, hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.activate(enigmaLedgerOfAncestry);
    game.passBoth();
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 1);

    Enigma.expectActivationRejected(enigmaLedgerOfAncestry);
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 1);
  });

  it("timing: the first Spectral Shield attack costs {r} less — free with 0 resources", () => {
    // Cosmo Scroll grants ward auras (the Spectral Shield token) a {r} attack;
    // Enigma's continuous discounts that first attack to 0 — payable at 0 RP.
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        weapon1: [cosmoScrollOfAncestralTapestry],
        chiPoints: 3,
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.activate(enigmaLedgerOfAncestry);
    game.passBoth();
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 1);

    Enigma.activate(fabToken("spectral-shield"));
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Enigma).toHaveResourceCount(0);
  });
});
