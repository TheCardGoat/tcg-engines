import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { figmentOfEruditionYellow } from "../instants/figment-of-erudition.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { angelicAttendantYellow } from "./angelic-attendant.ts";

/**
 * Angelic Attendant (SUP265) — Light Illusionist Action.
 *
 * Printed: "Awaken target figment you control.\nPut this into your soul.\nGo
 * again"
 *
 * Rules: CR 8.5.43 Awaken — flip a figment (or other dual-faced permanent) to
 * its permanent face and mark it awakened. Fragment verdict (plan §5): the
 * awaken leg is a DTD032-class vehicle gap — no figment in the catalog carries
 * a flip layout (the awaken reducer no-ops on single-faced cards), so the a1
 * flip is not publicly observable; the a2 soul move and go again are proven.
 */

describe("Angelic Attendant (SUP265) AAA", () => {
  it("happy: playing this with a figment controlled puts it into your soul and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [figmentOfEruditionYellow],
        hand: [angelicAttendantYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.play(angelicAttendantYellow);
    game.passBoth();

    expectFabCard(Prism, angelicAttendantYellow).toBeIn("soul");
    // go again refunds the spent action point (1 → 0 → 1).
    expectFabPlayer(Prism).toHaveAP(1);
  });

  it("boundary: the awaken target requires a controlled figment — with none the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [angelicAttendantYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    expect(() => Prism.play(angelicAttendantYellow)).toThrow();
    expectFabCard(Prism, angelicAttendantYellow).toBeIn("hand");
  });

  it("timing (vehicle-gap pin): awakening a single-faced figment is a silent no-op — it stays seated and uncounted", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [figmentOfEruditionYellow],
        hand: [angelicAttendantYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.play(angelicAttendantYellow);
    game.passBoth();

    // The figment is untouched by the awaken event (no flip layout to turn).
    expectFabCard(Prism, figmentOfEruditionYellow).toBeIn("arena");
    expectFabCard(Prism, figmentOfEruditionYellow).toHaveCounters(0);
  });
});
