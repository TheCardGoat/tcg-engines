import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * CR Chapter 9 — Additional Rules.
 *
 * 9.3 Marked: state flag on hero controller, seatable and visible in state.
 * 9.0 Resource cards pitch for printed value; legendary keyword on catalog resources.
 * DFC/split (9.1/9.2) and Living Legend formats are Non-goals (no flip gameplay).
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine, toFabCardDefinition } from "../../../index.ts";
import {
  bravo,
  crackedBaubleYellow,
  dash,
  heartOfFyendal,
  nimbleStrikeRed,
} from "../../fixtures.ts";

describe("CR 9 — Additional Rules", () => {
  it("9.3: a hero controller may be marked (game-state flag)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, marked: true, deck: 2 },
      { hero: dash, deck: 2 },
    );
    expect(game.getState().players[game.as(bravo).id]!.marked).toBe(true);
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
    const view = game.getView({ role: "player", actorId: game.as(dash).id });
    expect(view.players[game.as(bravo).id]!.marked).toBe(true);
  });

  it("9.0: resource cards without cost still pitch as payment (Cracked Bauble)", () => {
    const def = toFabCardDefinition(crackedBaubleYellow);
    expect(typeBoxTokens(def.base.typeBox)).toContain("Resource");
    expect(def.base.numeric.pitch).toBe(2);
    // Pitch bauble as payment for a cost-1 attack (CR 1.14.3b).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crackedBaubleYellow, nimbleStrikeRed], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
    );
    game.as(bravo).play(nimbleStrikeRed, {
      pitch: [crackedBaubleYellow],
      target: game.as(dash).id,
    });
    expect(game.as(bravo).resourcePoints()).toBe(1); // pitch 2 − cost 1
    expect(game.as(bravo).zone("pitch")).toContain(crackedBaubleYellow.canonicalId);
  });

  it("9.0 / legendary resource: Heart of Fyendal registers legendary keyword from catalog", () => {
    const def = toFabCardDefinition(heartOfFyendal);
    expect(
      def.base.keywords?.some((k) => (typeof k === "string" ? k : k.name) === "legendary"),
    ).toBe(true);
  });
});
