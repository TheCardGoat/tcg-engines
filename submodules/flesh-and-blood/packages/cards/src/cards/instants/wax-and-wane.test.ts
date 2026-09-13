import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { sigilOfSolitudeBlue } from "../actions/sigil-of-solitude.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { waxAndWaneBlue } from "./wax-and-wane.ts";

const fillerDeck = [
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
  brutalAssaultBlue,
] as const;

describe("Wax and Wane (PEN263) AAA", () => {
  it("happy: choosing both puts two +1{p} counters and searches Inner Chi to the top", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [sigilOfSolitudeBlue],
        hand: [waxAndWaneBlue],
        deck: [...fillerDeck, innerChiBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(waxAndWaneBlue, {
      modeIndexes: [0, 1],
      target: Enigma.cardIn("arena", sigilOfSolitudeBlue).instanceId,
    });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: innerChiBlue.canonicalId });

    expectFabCard(Enigma, sigilOfSolitudeBlue).toHaveCounters(2);
    expect(Enigma.zone("deck").at(-1)).toBe(innerChiBlue.canonicalId);
    expectFabCard(Enigma, waxAndWaneBlue).toBeIn("graveyard");
  });

  it("boundary: choosing one mode does not search Inner Chi", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [sigilOfSolitudeBlue],
        hand: [waxAndWaneBlue],
        deck: [...fillerDeck, innerChiBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(waxAndWaneBlue, {
      modeIndexes: [0],
      target: Enigma.cardIn("arena", sigilOfSolitudeBlue).instanceId,
    });
    game.untilIdle();

    expectFabCard(Enigma, sigilOfSolitudeBlue).toHaveCounters(1);
    expect(Enigma.cardsIn("deck", innerChiBlue)).toHaveLength(1);
    expectFabCard(Enigma, waxAndWaneBlue).toBeIn("graveyard");
  });

  it("timing: the searched Inner Chi is on top, not in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [sigilOfSolitudeBlue],
        hand: [waxAndWaneBlue],
        deck: [...fillerDeck, innerChiBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(waxAndWaneBlue, {
      modeIndexes: [0, 1],
      target: Enigma.cardIn("arena", sigilOfSolitudeBlue).instanceId,
    });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: innerChiBlue.canonicalId });

    expect(Enigma.zone("hand")).not.toContain(innerChiBlue.canonicalId);
    expect(Enigma.zone("deck").at(-1)).toBe(innerChiBlue.canonicalId);
  });
});
