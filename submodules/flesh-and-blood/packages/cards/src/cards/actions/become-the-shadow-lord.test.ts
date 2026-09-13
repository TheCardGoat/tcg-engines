import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { ghostlyVisitRed } from "./ghostly-visit.ts";
import { putridStirringsRed } from "./putrid-stirrings.ts";
import { sonataGalaxiaRed } from "./sonata-galaxia.ts";
import { snatchRed } from "./snatch.ts";
import { becomeTheShadowLordBlue } from "./become-the-shadow-lord.ts";

/**
 * Become the Shadow Lord (IAR113) — Shadow Runeblade Action, cost 0, 3{d}, go again.
 *
 * Printed: "Banish a card from your hand. If it's Runeblade, create a Runechant
 * token. If it's Shadow, create a Gate to i'Arathael token. Go again"
 */

describe("Become the Shadow Lord (IAR113) AAA", () => {
  it("happy: banishing a Shadow Runeblade creates a Runechant and a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [becomeTheShadowLordBlue, putridStirringsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(becomeTheShadowLordBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: putridStirringsRed.canonicalId,
    });

    expectFabCard(Chane, putridStirringsRed).toBeBanished();
    expect(Chane.zone("arena")).toContain("token:runechant");
    expect(Chane.zone("arena")).toContain("token:gate-to-i-arathael");
    expectFabCard(Chane, becomeTheShadowLordBlue).toBeIn("graveyard");
  });

  it("boundary: a Generic card creates neither token; Runeblade-only and Shadow-only split", () => {
    const runebladeOnly = FabTestEngine.start(
      {
        hero: chane,
        hand: [becomeTheShadowLordBlue, sonataGalaxiaRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const ChaneRuneblade = runebladeOnly.as(chane);
    ChaneRuneblade.play(becomeTheShadowLordBlue);
    runebladeOnly.helpers.resolveUntilIdle({
      entityTargetCanonicalId: sonataGalaxiaRed.canonicalId,
    });
    expectFabCard(ChaneRuneblade, sonataGalaxiaRed).toBeBanished();
    expect(ChaneRuneblade.zone("arena")).toContain("token:runechant");
    expect(ChaneRuneblade.zone("arena")).not.toContain("token:gate-to-i-arathael");

    const shadowOnly = FabTestEngine.start(
      {
        hero: chane,
        hand: [becomeTheShadowLordBlue, ghostlyVisitRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const ChaneShadow = shadowOnly.as(chane);
    ChaneShadow.play(becomeTheShadowLordBlue);
    shadowOnly.helpers.resolveUntilIdle({
      entityTargetCanonicalId: ghostlyVisitRed.canonicalId,
    });
    expectFabCard(ChaneShadow, ghostlyVisitRed).toBeBanished();
    expect(ChaneShadow.zone("arena")).not.toContain("token:runechant");
    expect(ChaneShadow.zone("arena")).toContain("token:gate-to-i-arathael");

    const generic = FabTestEngine.start(
      {
        hero: chane,
        hand: [becomeTheShadowLordBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const ChaneGeneric = generic.as(chane);
    ChaneGeneric.play(becomeTheShadowLordBlue);
    generic.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
    });
    expectFabCard(ChaneGeneric, snatchRed).toBeBanished();
    expect(ChaneGeneric.zone("arena")).not.toContain("token:runechant");
    expect(ChaneGeneric.zone("arena")).not.toContain("token:gate-to-i-arathael");
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [becomeTheShadowLordBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expectFabPlayer(Chane).toHaveAP(1);
    Chane.play(becomeTheShadowLordBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
    });
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
