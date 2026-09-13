import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { irisOfReality } from "../weapons/iris-of-reality.ts";
import { spearsOfSurrealityRed } from "./spears-of-surreality.ts";
import { shimmersOfSilverBlue } from "./shimmers-of-silver.ts";

describe("Shimmers of Silver (EVR140) AAA", () => {
  it("happy: attacking with the spectra aura-weapon puts a +1{p} counter on it", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [shimmersOfSilverBlue],
        weapon1: [irisOfReality],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(shimmersOfSilverBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Zyggy, shimmersOfSilverBlue).toBeIn("arena");
    expectFabPlayer(Zyggy).toHaveAP(1);

    Zyggy.activate(shimmersOfSilverBlue);
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expectFabCard(Zyggy, shimmersOfSilverBlue).toHaveCounters(1);
  });

  it("boundary: a non-aura-weapon attack does not put a +1{p} counter on this", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [shimmersOfSilverBlue, spearsOfSurrealityRed],
        weapon1: [irisOfReality],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(shimmersOfSilverBlue);
    game.helpers.resolveUntilIdle();
    Zyggy.attackWith(spearsOfSurrealityRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expectFabCard(Zyggy, shimmersOfSilverBlue).toHaveCounters(0);
  });

  it("timing: playing this on 1 AP spends the only action point", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [shimmersOfSilverBlue],
        weapon1: [irisOfReality],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(shimmersOfSilverBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Zyggy, shimmersOfSilverBlue).toBeIn("arena");
    expectFabPlayer(Zyggy).toHaveAP(0);

    const rejected = Zyggy.expectFailure({
      move: "activate",
      payload: { instanceId: Zyggy.findCardInZone("arena", shimmersOfSilverBlue) },
    });
    expect(rejected.errorCode).toBeDefined();
  });
});
