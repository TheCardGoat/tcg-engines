import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { tipTheBarkeepBlue } from "./tip-the-barkeep.ts";

describe("Tip the Barkeep (SEA132) AAA", () => {
  it("happy: creates a Goldkiss Rum token and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [tipTheBarkeepBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(tipTheBarkeepBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Gravy.zone("arena")).toContain("token:goldkiss-rum");
    expectFabCard(Gravy, tipTheBarkeepBlue).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: without a Gold token this stays in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [tipTheBarkeepBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(tipTheBarkeepBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Gravy, tipTheBarkeepBlue).toBeIn("graveyard");
    expect(game.as(dash).zone("arena")).not.toContain("token:gold");
  });

  it("synergy: giving a Gold token you control bottoms this in its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [tipTheBarkeepBlue],
        arena: [gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(tipTheBarkeepBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Gravy.zone("deck")).toContain(tipTheBarkeepBlue.canonicalId);
    expect(Gravy.zone("arena")).not.toContain(gold.canonicalId);
    expect(game.as(dash).zone("arena")).toContain(gold.canonicalId);
  });
});
