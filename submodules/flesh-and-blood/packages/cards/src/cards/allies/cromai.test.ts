import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { midasTouchYellow } from "../actions/midas-touch.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { nekria } from "./nekria.ts";
import { cromai } from "./cromai.ts";

describe("Cromai (UPR010) AAA", () => {
  it("happy: when Cromai attacks, her controller gains 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [stormOfSandikai],
        arena: [cromai],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.activate(cromai);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dromai, cromai).toBeIn("arena");
    // Attack spends 1 AP; the attack trigger refunds 1.
    expectFabPlayer(Dromai).toHaveAP(1);
  });

  it("boundary: another ally leaving the arena does not grant the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [cromai, nekria],
        hand: [midasTouchYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(midasTouchYellow, {
      target: Dromai.cardIn("arena", nekria).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dromai, nekria).toBeIn("graveyard");
    expectFabCard(Dromai, cromai).toBeIn("arena");
    expectFabPlayer(Dromai).toHaveAP(2);
  });

  it("timing: when Cromai leaves the arena, her controller gains 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arena: [cromai],
        hand: [midasTouchYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);

    Dromai.play(midasTouchYellow, {
      target: Dromai.cardIn("arena", cromai).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dromai, cromai).toBeIn("graveyard");
    // Instant play costs no AP: 2 seeded + 1 (leave-arena trigger) = 3.
    expectFabPlayer(Dromai).toHaveAP(3);
  });
});
