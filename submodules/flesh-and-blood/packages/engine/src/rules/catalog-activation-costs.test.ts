/**
 * Catalog activation cost validation: AP + resources must be checked before
 * mutating match state; attack-with weapon activations require an action point.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash } from "./fixtures.ts";
import { markOfTheHuntsman } from "../../../cards/src/cards/weapons/mark-of-the-huntsman.ts";
import { tectonicPlating } from "../../../cards/src/cards/equipment/tectonic-plating.ts";
import { fuelInjectorBlue } from "../../../cards/src/cards/actions/fuel-injector.ts";

describe("Catalog activation costs", () => {
  it("moves a real self-cost item to deck bottom without a target declaration", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [fuelInjectorBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(fuelInjectorBlue);

    expect(game.getState().decision).toBeNull();
    expect(Bravo.zone("arena")).not.toContain(fuelInjectorBlue.canonicalId);
    expect(Bravo.zone("deck")[0]).toBe(fuelInjectorBlue.canonicalId);
    expect(game.committedEvents().filter((event) => event.name === "shuffle-zone")).toHaveLength(0);

    game.passBoth();
    expect(game.getState().players[Bravo.id]!.resourcePoints).toBe(1);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("attack-with weapon activation rejects when AP is 0 (no free combat open)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [markOfTheHuntsman],
        actionPoints: 0,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const weaponId = game.as(bravo).findCardInZone("weapon1", markOfTheHuntsman);
    const rej = game.as(bravo).expectFailure({
      move: "activate",
      payload: {
        instanceId: weaponId,
        ability: "M9DL6cPLrKkmDhGpQL7Mg:oncePerTurnActionResourceResourceAttackGoAgain",
        target: game.as(dash).id,
      },
    });
    expect(rej.errorCode).toBe("insufficient_action_points");
    expect(game.combat()?.open).toBeFalsy();
    expect(game.as(bravo).actionPoints()).toBe(0);
    // Resources must not be debited when AP validation fails.
    expect(game.getState().players[game.as(bravo).id]!.resourcePoints).toBe(2);
  });

  it("non-attack Action activation rejects on 0 AP without debiting resources", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [tectonicPlating],
        actionPoints: 0,
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const equipId = game.as(bravo).findCardInZone("chest", tectonicPlating);
    const rej = game.as(bravo).expectFailure({
      move: "activate",
      payload: {
        instanceId: equipId,
        ability: "TN6DmN7GK9DtMKd9pnmwF:oncePerTurnActionCreateSeismicSurgeAuraToken",
      },
    });
    expect(rej.errorCode).toBe("insufficient_action_points");
    expect(game.getState().players[game.as(bravo).id]!.resourcePoints).toBe(3);
    expect(game.as(bravo).zone("chest")).toContain(tectonicPlating.canonicalId);
  });

  it("attack-with weapon activation spends AP when legal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [markOfTheHuntsman],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const weaponId = game.as(bravo).findCardInZone("weapon1", markOfTheHuntsman);
    game.as(bravo).exec({
      move: "activate",
      payload: {
        instanceId: weaponId,
        ability: "M9DL6cPLrKkmDhGpQL7Mg:oncePerTurnActionResourceResourceAttackGoAgain",
        target: game.as(dash).id,
      },
    });
    game.passBoth();
    expect(game.combat()?.open).toBe(true);
    expect(game.as(bravo).actionPoints()).toBe(0);
    expect(game.getState().players[game.as(bravo).id]!.resourcePoints).toBe(0);
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
  });
});
