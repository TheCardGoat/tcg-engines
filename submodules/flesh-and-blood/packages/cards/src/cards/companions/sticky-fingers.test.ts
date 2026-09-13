import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { stickyFingers } from "./sticky-fingers.ts";

/**
 * Sticky Fingers (JDG045) — Scurv Companion - Off-Hand Ally, Perched.
 *
 * Printed:
 *   Action - {t}: Attack. If this is equipped, unequip it.
 *   When this attacks a hero, steal a Gold token they control.
 */

describe("Sticky Fingers (JDG045) AAA", () => {
  it("happy: attacking a hero with Sticky Fingers steals a Gold they control", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        arena: [stickyFingers],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("gold")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activate(stickyFingers, {
      abilityId: `${stickyFingers.canonicalId}:attackAndUnequip`,
    });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kassai).toHaveTokenCount("gold", 1);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabCard(Kassai, stickyFingers).toBeIn("arena");
  });

  it("boundary: with no Gold to steal the attack still lands", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        arena: [stickyFingers],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const _Dash = game.as(dash);

    Kassai.activate(stickyFingers, {
      abilityId: `${stickyFingers.canonicalId}:attackAndUnequip`,
    });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kassai).toHaveTokenCount("gold", 0);
  });
});
