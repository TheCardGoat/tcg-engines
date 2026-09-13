import { describe, expect, it } from "vitest";
import { phantasmaclasmRed } from "../../../../../../cards/src/cards/actions/phantasmaclasm.ts";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  crackedBaubleYellow,
  dash,
  heartOfFyendalBlue,
  nimblismBlue,
  sigilOfSolaceRed,
  snatchRed,
} from "../../../fixtures.ts";

describe("Phantasmaclasm (MON091)", () => {
  it("determines the defending hand at resolution, bottoms the attacker's choice, and the defender draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [phantasmaclasmRed, heartOfFyendalBlue],
        deck: 8,
        actionPoints: 1,
      },
      {
        hero: dash,
        hand: [nimblismBlue, sigilOfSolaceRed, snatchRed, crackedBaubleYellow],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(phantasmaclasmRed, {
      target: Dash.id,
      pitch: heartOfFyendalBlue,
    });
    expect(Dash.zone("hand")).toHaveLength(4);
    expect(Dash.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).toEqual([heartOfFyendalBlue.canonicalId]);
  });
});
