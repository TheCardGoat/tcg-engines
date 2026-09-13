import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { lookWithinBlue } from "./look-within.ts";

/**
 * Look Within (PEN273) — Mystic Action, cost 0, go again.
 *
 * Printed: Search your deck for a Chi, reveal it, shuffle, then put it on top.
 * Go again
 *
 * Search-to-deck puts the Chi on top; this card resolves to the graveyard.
 */

const fillerDeck = [
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
] as const;

describe("Look Within (PEN273) AAA", () => {
  it("happy: searched Chi is put on top and Look Within resolves to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [lookWithinBlue],
        deck: [...fillerDeck, innerChiBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(lookWithinBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: innerChiBlue.canonicalId });

    expect(Enigma.zone("deck").at(-1)).toBe(innerChiBlue.canonicalId);
    expectFabCard(Enigma, lookWithinBlue).toBeIn("graveyard");
  });

  it("boundary: a deck with no Chi still resolves Look Within to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [lookWithinBlue],
        deck: [...fillerDeck, brutalAssaultBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(lookWithinBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Enigma.zone("deck")).toHaveLength(6);
    expectFabCard(Enigma, lookWithinBlue).toBeIn("graveyard");
    expect(Enigma.zone("deck")).not.toContain(lookWithinBlue.canonicalId);
  });

  it("timing: go again refunds the spent action point", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [lookWithinBlue],
        deck: [...fillerDeck, innerChiBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(lookWithinBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: innerChiBlue.canonicalId });

    expectFabPlayer(Enigma).toHaveAP(1);
  });
});
