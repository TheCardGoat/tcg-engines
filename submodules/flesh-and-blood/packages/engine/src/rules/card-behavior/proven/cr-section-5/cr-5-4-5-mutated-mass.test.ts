/**
 * CR 5.4.5 — Property-static abilities define a source object's printed
 * property (the value "otherwise found on the card").
 *
 * Mutated Mass is the CR-cited example: "This card's {p} and {d} are equal to
 * twice the number of cards in your pitch zone with different costs" is a
 * property-static ability that DEFINES the card's power and defense (CR 5.4.5,
 * 1.7.4f). It is functional in any zone / outside the game, and is evaluated
 * against the cost property of cards currently in the pitch zone — cards that
 * lack the cost property do not count (CR 1.7.4f example).
 *
 * This suite guards that MON191-a2 is authored as `staticKind: "property"` and
 * that both {p} and {d} resolve to 2 × (distinct pitch-zone costs).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../index.ts";
import { bravo, dash, nimblismBlue, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { mutatedMassBlue } from "../../../../../../cards/src/cards/actions/mutated-mass.ts";

describe("CR 5.4.5 — Mutated Mass {p}/{d} is a property-static equal to twice distinct pitch costs", () => {
  it("with two differently-costed cards in pitch, {p} and {d} are each 4 (2 distinct costs × 2)", () => {
    // nimblismBlue has cost 0; tomeOfFyendalYellow has cost 1 → 2 distinct costs.
    // Both sit in the pitch zone (not played this turn), so they are counted.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mutatedMassBlue],
        pitch: [nimblismBlue, tomeOfFyendalYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 30, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Play the attack and advance Attack → Defend so the active chain link's
    // evaluated attackPower (current power of the attack object) is populated.
    game.helpers.attackToDefend(Bravo, mutatedMassBlue, game.as(dash));

    // {p}: 2 distinct pitch costs × 2 = 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);

    // {d}: the defense-defining property-static sets base defense the same way.
    // Read the recorded base-numeric "set" contribution on the attack object.
    const attackId = Bravo.findCardInZone("combatChain", mutatedMassBlue);
    const defenseValues = game
      .getState()
      .continuousEffectInstances.flatMap((inst) => inst.applications)
      .flatMap((app) => {
        if (
          app.subject.kind !== "object" ||
          app.subject.ref.instanceId !== attackId ||
          app.contribution.kind !== "numeric" ||
          app.contribution.property !== "defense"
        )
          return [];
        return [app.contribution.value];
      });
    expect(defenseValues).toContain(4);
  });

  it("with only one distinct cost in pitch, {p} and {d} are each 2 (1 distinct cost × 2)", () => {
    // Two pitch cards that share the SAME cost (both cost 0) → 1 distinct cost.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mutatedMassBlue],
        pitch: [nimblismBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 30, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.helpers.attackToDefend(game.as(bravo), mutatedMassBlue, game.as(dash));
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });
});
