import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { cutNCarveRed } from "./cut-n-carve.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { nekria } from "../allies/nekria.ts";
import { cromai } from "../allies/cromai.ts";
import { dustFromTheShadowCryptsRed } from "./dust-from-the-shadow-crypts.ts";

/**
 * Dust from the Shadow Crypts (DYN004) — Draconic Illusionist Action - Ash.
 *
 * Printed: Material - While this is under a permanent other than Nekria,
 * that permanent has phantasm.
 */

describe("Dust from the Shadow Crypts (DYN004) AAA", () => {
  it("happy: hosted under another permanent it arms phantasm; its paired dragon gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [cromai],
        weapon1: [zenithBlade],
        hand: [cutNCarveRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: [dustFromTheShadowCryptsRed],
      },
      { hero: dash, arena: [nekria], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    // Construction layout: Material faces sit beneath their live host before
    // the first turn. Seat one copy under a permanent whose name differs from
    // Nekria, and its paired twin under Nekria itself.
    game.createObject({
      instanceId: "dust-under-free-host",
      canonicalId: dustFromTheShadowCryptsRed.canonicalId,
      ownerId: Dromai.id,
      zone: "under",
    });
    const freeHost = Dromai.cardIn("arena", cromai).instanceId;
    game.hostUnder("dust-under-free-host", freeHost);
    game.createObject({
      instanceId: "dust-under-named-host",
      canonicalId: dustFromTheShadowCryptsRed.canonicalId,
      ownerId: Dash.id,
      zone: "under",
    });
    const namedHost = Dash.cardIn("arena", nekria).instanceId;
    game.hostUnder("dust-under-named-host", namedHost);

    // Continuous instances register through committed events only, so run one
    // ordinary public play to drive reconciliation with materials now seated.
    Dromai.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    expectFabCard(Dromai, cromai).toHaveKeyword("phantasm");
    expectFabCard(Dash, nekria).notToHaveKeyword("phantasm");
  });
});
