import { describe, it } from "vitest";
import {
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { unicycle } from "./unicycle.ts";

const cog = fabToken("golden-cog");
const copper = fabToken("copper");

/**
 * Unicycle (SEA010) — Mechanologist Equipment - Legs.
 *
 * Printed: Instant - Destroy this: {u} (untap) a cog you control. Battleworn.
 */

describe("Unicycle (SEA010) AAA", () => {
  it("happy: destroying this untaps a tapped cog you control", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [unicycle],
        arena: [{ card: cog, state: { tapped: true } }],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(unicycle);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Teklo, unicycle).toBeIn("graveyard");
    expectFabCard(Teklo, cog).toBeReady();
  });

  it("boundary: a tapped non-Cog permanent is not untapped", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [unicycle],
        arena: [
          { card: cog, state: { tapped: true } },
          { card: copper, state: { tapped: true } },
        ],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(unicycle);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Teklo, cog).toBeReady();
    expectFabCard(Teklo, copper).toBeTapped();
    expectFabCard(Teklo, unicycle).toBeIn("graveyard");
  });
});
