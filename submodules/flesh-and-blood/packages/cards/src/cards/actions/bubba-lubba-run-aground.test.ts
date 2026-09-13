import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { might } from "../tokens/might.ts";
import { bubbaLubbaRunAgroundYellow } from "./bubba-lubba-run-aground.ts";

describe("Bubba Lubba, Run Aground (PEN157) AAA", () => {
  it("happy: enters with a +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [bubbaLubbaRunAgroundYellow],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(bubbaLubbaRunAgroundYellow);
    game.passBoth();

    expectFabCard(Gravy, bubbaLubbaRunAgroundYellow).toBeIn("arena");
    expectFabCard(Gravy, bubbaLubbaRunAgroundYellow).toHavePower(2);
  });

  it("happy: remove a +1{p} counter to destroy an aura token", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [bubbaLubbaRunAgroundYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, arena: [might], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(bubbaLubbaRunAgroundYellow);
    game.passBoth();
    expectFabCard(Gravy, bubbaLubbaRunAgroundYellow).toHavePower(2);

    Gravy.activate(bubbaLubbaRunAgroundYellow, {
      abilityId: `${bubbaLubbaRunAgroundYellow.canonicalId}:actionRemove1CounterFromAllyControlDestroyAura`,
    });
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      entityTargetCanonicalId: might.canonicalId,
    });

    expect(game.as(dash).zone("arena")).not.toContain(might.canonicalId);
    expectFabCard(Gravy, bubbaLubbaRunAgroundYellow).toHavePower(1);
  });

  it("boundary: without a +1{p} counter the destroy-aura activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [bubbaLubbaRunAgroundYellow],
        deck: 6,
      },
      { hero: dash, arena: [might], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() =>
      game.as(gravyBones).activate(bubbaLubbaRunAgroundYellow, {
        abilityId: `${bubbaLubbaRunAgroundYellow.canonicalId}:actionRemove1CounterFromAllyControlDestroyAura`,
      }),
    ).toThrow();
    expect(game.as(dash).zone("arena")).toContain(might.canonicalId);
  });
});
