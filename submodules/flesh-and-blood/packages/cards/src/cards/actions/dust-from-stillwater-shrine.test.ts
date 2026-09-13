import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { vynserakai } from "../allies/vynserakai.ts";
import { cutNCarveRed } from "./cut-n-carve.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { dustFromStillwaterShrineRed } from "./dust-from-stillwater-shrine.ts";

/**
 * Dust from Stillwater Shrine (MST235) — Draconic Illusionist Action - Ash.
 *
 * Printed: Material - While this is under a permanent other than Miragai,
 * that permanent has phantasm.
 *
 * The literal paired-host negative (seating the Dust under Miragai herself)
 * is unprovable until Miragai's own anti-phantasm static stops suppressing
 * unrelated grants while she is merely in play; exclusion semantics for this
 * shared condition path are proven across the sibling Ash suites.
 */

describe("Dust from Stillwater Shrine (MST235) AAA", () => {
  it("happy: hosted under a permanent other than Miragai it arms phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [vynserakai],
        weapon1: [zenithBlade],
        hand: [cutNCarveRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: [dustFromStillwaterShrineRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    // Construction layout: the Material face sits beneath its live host
    // before the first turn; Vynserakai is "a permanent other than Miragai".
    game.createObject({
      instanceId: "dust-under-free-host",
      canonicalId: dustFromStillwaterShrineRed.canonicalId,
      ownerId: Dromai.id,
      zone: "under",
    });
    const freeHost = Dromai.cardIn("arena", vynserakai).instanceId;
    game.hostUnder("dust-under-free-host", freeHost);

    // Continuous instances register through committed events only, so run one
    // ordinary public play to drive reconciliation with the material seated.
    Dromai.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    expectFabCard(Dromai, vynserakai).toHaveKeyword("phantasm");
  });
});
