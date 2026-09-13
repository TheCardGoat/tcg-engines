import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { invokeYenduraiRed } from "../actions/invoke-yendurai.ts";
import { fabToken } from "@tcg/flesh-and-blood-engine/testing";

/**
 * Yendurai (UPR017) — Draconic Illusionist Dragon Ally.
 *
 * Printed: Yendurai enters the arena with an endurance counter on him.
 * If Yendurai would be dealt damage, remove an endurance counter from him
 * to prevent 3 of that damage.
 *
 * The ally is seated through its invocation (flip layout — the invocation
 * card becomes the arena object); the transform lifecycle and go-again are
 * covered by the UPR017-invoke-yendurai-red sibling suite. The prevention
 * leg needs an ally-damageable effect (no legal 1v1 enabler in the corpus).
 */

describe("Yendurai (UPR017) AAA", () => {
  it("happy: enters the arena through its invocation with an endurance counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [invokeYenduraiRed],
        arena: [fabToken("ash")],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(invokeYenduraiRed);
    game.passBoth();

    // The seated ally object carries the printed endurance counter.
    expectFabCard(Dromai, invokeYenduraiRed).toHaveCounters(1, "endurance");
    expect(Dromai.zone("arena")).not.toContain("token:ash");
    expectFabPlayer(Dromai).toHaveAP(2);
  });
});
