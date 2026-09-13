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
import { cromai } from "../allies/cromai.ts";
import { vynserakai } from "../allies/vynserakai.ts";
import { dustFromTheChromeCavernsRed } from "./dust-from-the-chrome-caverns.ts";

/**
 * Dust from the Chrome Caverns (EVO246) — Draconic Illusionist Action - Ash.
 *
 * Printed: Material - While this is under a permanent other than Cromai,
 * that permanent has phantasm.
 */

describe("Dust from the Chrome Caverns (EVO246) AAA", () => {
  it("happy: hosted under another permanent it arms phantasm; its paired dragon gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [vynserakai],
        weapon1: [zenithBlade],
        hand: [cutNCarveRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: [dustFromTheChromeCavernsRed],
      },
      { hero: dash, arena: [cromai], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    // Construction layout: Material faces sit beneath their live host before
    // the first turn. Seat one copy under a permanent whose name differs from
    // Cromai, and its paired twin under Cromai itself.
    game.createObject({
      instanceId: "dust-under-free-host",
      canonicalId: dustFromTheChromeCavernsRed.canonicalId,
      ownerId: Dromai.id,
      zone: "under",
    });
    const freeHost = Dromai.cardIn("arena", vynserakai).instanceId;
    game.hostUnder("dust-under-free-host", freeHost);
    game.createObject({
      instanceId: "dust-under-named-host",
      canonicalId: dustFromTheChromeCavernsRed.canonicalId,
      ownerId: Dash.id,
      zone: "under",
    });
    const namedHost = Dash.cardIn("arena", cromai).instanceId;
    game.hostUnder("dust-under-named-host", namedHost);

    // Continuous instances register through committed events only, so run one
    // ordinary public play to drive reconciliation with materials now seated.
    Dromai.play(cutNCarveRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });

    expectFabCard(Dromai, vynserakai).toHaveKeyword("phantasm");
    expectFabCard(Dash, cromai).notToHaveKeyword("phantasm");
  });
});
