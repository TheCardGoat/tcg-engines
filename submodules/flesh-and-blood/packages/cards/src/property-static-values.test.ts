import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  type FabPlayerHandle,
} from "@tcg/flesh-and-blood-engine/testing";
import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";

import { dash } from "./cards/heroes/dash.ts";
import { commandAndConquerRed } from "./cards/actions/command-and-conquer.ts";
import { bloodiedOval } from "./cards/equipment/bloodied-oval.ts";
import { spectralProcessionRed } from "./cards/actions/spectral-procession.ts";
import { rok } from "./cards/weapons/rok.ts";
import { mutatedMassBlue } from "./cards/actions/mutated-mass.ts";
import { prism } from "./cards/heroes/prism.ts";
import { spectralShield } from "./cards/tokens/spectral-shield.ts";
import { toughAsARokBlue } from "./cards/actions/tough-as-a-rok.ts";
import { rockyardRodeoBlue } from "./cards/actions/rockyard-rodeo.ts";
import { tuffnut } from "./cards/heroes/tuffnut.ts";
import { crowdGoesWildYellow } from "./cards/actions/crowd-goes-wild.ts";
import { nimblismBlue } from "./cards/actions/nimblism.ts";
import { disableRed } from "./cards/actions/disable.ts";

function projectedNumeric(
  game: FabTestEngine,
  player: FabPlayerHandle,
  zone: "hand" | "arsenal" | "weapon1",
  card: FleshAndBloodCard,
) {
  const instanceId = player.findCardInZone(zone, card);
  return game.getView({ role: "player", actorId: player.id }).currentNumericByInstanceId?.[
    instanceId
  ];
}

describe("CR 5.4.5 property-static values", () => {
  it("projects Crowd Goes Wild's payable hand cost after the crowd cheers", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [crowdGoesWildYellow],
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          commandAndConquerRed,
        ],
        resourcePoints: 0,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expect(projectedNumeric(game, Tuffnut, "hand", crowdGoesWildYellow)?.cost).toBe(3);

    Tuffnut.activate(tuffnut);
    game.helpers.resolveUntilIdle();

    expect(projectedNumeric(game, Tuffnut, "hand", crowdGoesWildYellow)?.cost).toBe(0);
  });

  it("projects Rockyard Rodeo's weapon-defined power in hand and arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        weapon1: [rok],
        hand: [rockyardRodeoBlue],
        arsenal: [rockyardRodeoBlue],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expect(projectedNumeric(game, Tuffnut, "hand", rockyardRodeoBlue)).toMatchObject({
      power: 7,
      defense: 2,
    });
    expect(projectedNumeric(game, Tuffnut, "arsenal", rockyardRodeoBlue)).toMatchObject({
      power: 7,
      defense: 2,
    });
  });

  it("projects Mutated Mass power and defense from distinct pitch costs while in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [mutatedMassBlue],
        pitch: [nimblismBlue, rockyardRodeoBlue, disableRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expect(projectedNumeric(game, Tuffnut, "hand", mutatedMassBlue)).toMatchObject({
      power: 6,
      defense: 6,
    });
  });

  it("projects life-, token-, and opponent-dependent star values before combat", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        life: 10,
        hand: [spectralProcessionRed],
        arsenal: [toughAsARokBlue],
        arena: [spectralShield, spectralShield],
        weapon1: [bloodiedOval],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    expect(projectedNumeric(game, Prism, "hand", spectralProcessionRed)?.power).toBe(2);
    expect(projectedNumeric(game, Prism, "arsenal", toughAsARokBlue)?.power).toBe(6);
    expect(projectedNumeric(game, Prism, "weapon1", bloodiedOval)?.defense).toBe(1);
  });
});
