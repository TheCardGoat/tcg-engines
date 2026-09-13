import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { arakniBlackWidow } from "./arakni-black-widow.ts";

describe("Arakni, Black Widow (HNT003) AAA", () => {
  it("happy: at the beginning of your end phase this returns to the brood while remaining in arena", () => {
    const game = FabTestEngine.start(
      { hero: arakniMarionette, arena: [arakniBlackWidow], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.endTurn();
    game.untilIdle();

    expectFabCard(Arakni, arakniBlackWidow).toBeIn("arena");
  });

  it("boundary: an Agent in inventory does not return to the brood", () => {
    const game = FabTestEngine.start(
      { hero: arakniMarionette, inventory: [arakniBlackWidow], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.endTurn();
    game.untilIdle();

    expect(Arakni.zone("inventory")).toContain(arakniBlackWidow.canonicalId);
  });

  it("timing: this does not trigger on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: arakniMarionette, arena: [arakniBlackWidow], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Arakni, arakniBlackWidow).toBeIn("arena");
  });
});
