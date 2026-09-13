import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { enigmaLedgerOfAncestry } from "../heroes/enigma-ledger-of-ancestry.ts";
import { snatchRed } from "../actions/snatch.ts";
import { meridianPathway } from "./meridian-pathway.ts";

describe("Meridian Pathway (MST027) AAA", () => {
  it("happy: pitching a Chi may give this Ward 3 until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        legs: [meridianPathway],
        hand: [snatchRed, innerChiBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.must.pitch(innerChiBlue).playAttack(snatchRed);
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Enigma, meridianPathway).toHaveKeyword("ward");
  });

  it("boundary: pitching a non-Chi card does not grant Ward from this", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        legs: [meridianPathway],
        hand: [snatchRed, innerChiBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.must.pitch(innerChiBlue).playAttack(snatchRed);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Enigma, meridianPathway).toHaveKeyword("ward");
  });

  it("timing: Instant {c}{c}{c} spends three Chi", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        legs: [meridianPathway],
        hand: [innerChiBlue, innerChiBlue, innerChiBlue],
        chiPoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    expect(() => {
      Enigma.activate(meridianPathway);
      game.untilIdle({ optionals: "decline" });
    }).toThrow(/Pitch a card to pay/);
    expectFabCard(Enigma, meridianPathway).toBeIn("legs");
  });
});
