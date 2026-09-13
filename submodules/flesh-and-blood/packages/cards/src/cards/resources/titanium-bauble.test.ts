import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { titaniumBaubleBlue } from "./titanium-bauble.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";

/**
 * Titanium Bauble Blue (DVR027) — Generic Resource.
 *
 * Printed: (vanilla — no abilities)
 *   Pitch 3, defense 3.
 *
 * Its rules-visible behavior is the blue pitch value; authoring structure is
 * enforced by TypeScript and is not repeated as a gameplay assertion.
 */

describe("Titanium Bauble Blue (DVR027) AAA", () => {
  it("timing: pitching the bauble pays 3 resources toward a play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [titaniumBaubleBlue, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // Pitch the blue bauble (3 resources) to fund Brutal Assault (cost 3) —
    // the pitch actually moves the card and lands in the pitch zone.
    Dash.play(brutalAssaultBlue, { pitch: [titaniumBaubleBlue] });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, titaniumBaubleBlue).toBeIn("pitch");
    expect(Dash.zone("hand")).toHaveLength(0);
    // Pitched 3 (blue) minus Brutal Assault's 2 cost leaves 1 floating.
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });
});
