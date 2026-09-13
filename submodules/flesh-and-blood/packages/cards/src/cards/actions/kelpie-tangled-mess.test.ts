import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { kelpieTangledMessYellow } from "./kelpie-tangled-mess.ts";

describe("Kelpie, Tangled Mess (SEA059) AAA", () => {
  it("happy: Action taps target ally", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [kelpieTangledMessYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [barnacleYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(kelpieTangledMessYellow, {
      abilityId: "QCKrPkcL9crDhmNhQTnPc:actionResourceTapTapTargetAllyGoAgain",
    });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: barnacleYellow.canonicalId });

    expectFabCard(game.as(dash), barnacleYellow).toBeTapped();
    expectFabCard(Gravy, kelpieTangledMessYellow).toBeTapped();
  });

  it("boundary: a tapped Kelpie cannot fire the tap ability", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, arena: [kelpieTangledMessYellow], resourcePoints: 1, deck: 6 },
      { hero: dash, arena: [barnacleYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    Gravy.activate(kelpieTangledMessYellow, {
      abilityId: "QCKrPkcL9crDhmNhQTnPc:actionTapAttack",
    });
    game.helpers.resolveRestOfCombat();
    expect(() =>
      Gravy.activate(kelpieTangledMessYellow, {
        abilityId: "QCKrPkcL9crDhmNhQTnPc:actionResourceTapTapTargetAllyGoAgain",
      }),
    ).toThrow();
    expectFabCard(game.as(dash), barnacleYellow).toBeReady();
  });

  it("timing: tap-Attack returns Kelpie to the arena", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, arena: [kelpieTangledMessYellow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(kelpieTangledMessYellow, {
      abilityId: "QCKrPkcL9crDhmNhQTnPc:actionTapAttack",
    });
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, kelpieTangledMessYellow).toBeIn("arena");
  });
});
