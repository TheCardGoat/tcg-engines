import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { gravenCall } from "./graven-call.ts";

describe("Graven Call (HVY245) AAA", () => {
  it("happy: activate costs 2 resources, opens combat with piercing and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [gravenCall],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(gravenCall, {
      abilityId: "Ng9LqqDzcwcTmQmDzWzjT:oncePerTurnActionResourceResourceAttackGoAgain",
    });
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    expect(game.combat()?.activeLink?.keywords).toContain("piercing");

    game.helpers.resolveRestOfCombat();
    expect(Arakni.actionPoints()).toBe(1);
  });

  it("boundary: base power is 1 with no additional modifiers", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [gravenCall],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(arakniMarionette).activate(gravenCall, {
      abilityId: "Ng9LqqDzcwcTmQmDzWzjT:oncePerTurnActionResourceResourceAttackGoAgain",
    });
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("timing: once per turn — second activation in the same turn is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [gravenCall],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(gravenCall, {
      abilityId: "Ng9LqqDzcwcTmQmDzWzjT:oncePerTurnActionResourceResourceAttackGoAgain",
    });
    game.helpers.resolveRestOfCombat();

    Arakni.expectActivationRejected(
      gravenCall,
      "Ng9LqqDzcwcTmQmDzWzjT:oncePerTurnActionResourceResourceAttackGoAgain",
    );
  });
});
