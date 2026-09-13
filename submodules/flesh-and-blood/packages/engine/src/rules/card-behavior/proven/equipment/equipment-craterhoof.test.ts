/**
 * MPG008 Craterhoof — Guardian Legs d1 battleworn.
 * Printed: Action - {r}{r}{r}, destroy this: The next Guardian attack action
 * card you play from arsenal this turn gets dominate. Go again
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { boulderDropRed } from "../../../../../../cards/src/cards/actions/boulder-drop.ts";
import { craterhoof } from "../../../../../../cards/src/cards/equipment/craterhoof.ts";

const LIFE = 20;
const BOULDER_P = 7;

describe("craterhoof (MPG008)", () => {
  it("AAA: {r}{r}{r}+destroy → next Guardian attack from arsenal gets dominate + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [craterhoof],
        arsenal: [boulderDropRed],
        hand: [],
        actionPoints: 1,
        resourcePoints: 6,
        deck: 6,
      },
      { hero: dash, hand: [], life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Activate Craterhoof: pay 3, destroy self, itself gains go again.
    Bravo.activate(craterhoof);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(Bravo.zone("legs")).not.toContain(craterhoof.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(craterhoof.canonicalId);
    // Self go again refunds the activation AP (1 → 1).
    expect(Bravo.actionPoints()).toBe(1);

    // Play the Guardian attack from arsenal — gets dominate.
    Bravo.attackWith(boulderDropRed, { target: game.as(dash).id, from: "arsenal" });
    game.advanceCombatTo("reaction");
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("dominate");
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expect(game.as(dash).life()).toBe(LIFE - BOULDER_P);
    // "Go again" is Craterhoof's own activation keyword — the attack only
    // gained dominate (AP spent on the attack stays spent).
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundary: two resources cannot activate the three-resource ability", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [craterhoof],
        arsenal: [boulderDropRed],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(craterhoof)).toThrow();
    expect(game.as(bravo).zone("legs")).toContain(craterhoof.canonicalId);
  });
});
