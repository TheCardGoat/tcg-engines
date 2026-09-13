import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismRed } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { sigilOfBrillianceYellow } from "../instants/sigil-of-brilliance.ts";
import { ash } from "./ash.ts";

/**
 * Ash (DRO002) — Draconic Illusionist Token - Ash.
 * Printed: "Material - While this is under a permanent, that permanent gets
 * phantasm."
 *
 * The host relation is arranged with the engine's arrange-only material
 * seating (`game.hostUnder`, documented for exactly this Ash-material case);
 * no authored effect moves a created Ash under a live permanent.
 */
describe("Ash (DRO002) AAA", () => {
  it("happy: while an Ash is under a permanent, that permanent is evaluated with phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        arena: [sigilOfBrillianceYellow, ash],
        hand: [nimblismRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    const hostId = Dromai.findCardInZone("arena", sigilOfBrillianceYellow);
    const ashId = Dromai.findCardInZone("arena", ash);
    game.hostUnder(ashId!, hostId!);

    // A legal move forces the continuous reconciler to re-evaluate the host.
    Dromai.play(nimblismRed);
    game.helpers.untilIdle();

    expectFabCard(Dromai, sigilOfBrillianceYellow).toHaveKeyword("phantasm");
    expectFabCard(Dromai, ash).toBeUnder(sigilOfBrillianceYellow);
  });

  it("boundary: without an Ash under it, the same permanent has no phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        arena: [sigilOfBrillianceYellow],
        hand: [nimblismRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(nimblismRed);
    game.helpers.untilIdle();

    expectFabCard(Dromai, sigilOfBrillianceYellow).notToHaveKeyword("phantasm");
    expectFabPlayer(Dromai).toHaveTokenCount("ash", 0);
  });

  it("timing: Dromai pitching a red card creates an Ash token the Material can ride on", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        arena: [sigilOfBrillianceYellow],
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(tomeOfFyendalYellow, { pitch: [snatchRed] });
    game.passBoth();

    expectFabPlayer(Dromai).toHaveTokenCount("ash", 1);
  });
});
