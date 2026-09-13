import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { riggermortisYellow } from "./riggermortis.ts";

describe("Riggermortis (AGB018) AAA", () => {
  it("happy: play the ally, then tap and pay {r} to attack for 6", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [riggermortisYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(riggermortisYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Gravy, riggermortisYellow).toBeIn("arena");

    Gravy.activate(riggermortisYellow);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expectFabCard(Gravy, riggermortisYellow).toBeTapped();
  });

  it("boundary: watery-grave play from graveyard is illegal without Gravy's blue-GY permission", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        graveyard: [riggermortisYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const instanceId = Gravy.findCardInZone("graveyard", riggermortisYellow);
    const rejected = Gravy.expectFailure({
      move: "begin-play",
      payload: { instanceId, from: "graveyard" },
    });
    expect(rejected.errorCode).toBeDefined();
    expectFabCard(Gravy, riggermortisYellow).toBeIn("graveyard");
  });
});
