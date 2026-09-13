import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { surayaArchangelOfKnowledge } from "../allies/suraya-archangel-of-knowledge.ts";
import { nekria } from "../allies/nekria.ts";
import { slayRed } from "./slay.ts";

/**
 * Slay (EVO248) — Instant, red.
 *
 * Printed: Destroy target angel ally.
 */

describe("Slay (EVO248) AAA", () => {
  it("happy: destroys target angel ally", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [slayRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [surayaArchangelOfKnowledge], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(slayRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: surayaArchangelOfKnowledge.canonicalId,
    });

    expectFabCard(game.as(dash), surayaArchangelOfKnowledge).toBeIn("graveyard");
  });

  it("boundary: a non-angel ally is not a legal target — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [nekria],
        hand: [slayRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    expectFabUnplayable(() => Dromai.must.play(slayRed), /no legal target|not legal|target/i);
    expectFabCard(Dromai, slayRed).toBeIn("hand");
    expectFabCard(Dromai, nekria).toBeIn("arena");
  });
});
