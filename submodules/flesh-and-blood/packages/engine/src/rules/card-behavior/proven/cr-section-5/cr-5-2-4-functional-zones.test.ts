/**
 * CR 5.2.4 — an activated ability's functionality may be gated to the zone its
 * source is in, via `functionalZones`. "If an activated ability's cost can only
 * be paid when the source is private, or if its activation condition specifies
 * the privacy status and/or zone of its source, the ability is functional when
 * the source meets that requirement."
 *
 * The engine already honors `functionalZones` for STATIC and play-permission
 * abilities (continuous/reconciler.ts `staticAbilityIsFunctional`,
 * snapshots.ts `isFunctionalInZone`), but the activation path
 * (activation/stages/{begin,quote}.ts) infers zone legality only from cost
 * shape and timing — it never reads `ability.functionalZones`. This suite
 * proves the activation path now consults that field: an activated ability
 * authored with `functionalZones: ["banished"]` is activatable while its source
 * is in the banished zone and NOT activatable while in hand.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../index.ts";
import type { FabCardDefinitionInput } from "../../../../cards.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { trainerId } from "../../../test-trainers.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

/** Activated ability that is functional ONLY in the banished zone. Cost 0 so
 * the only thing gating its activation is the functionalZones declaration. */
const banishedOnlyActivatable: FabCardDefinitionInput = {
  canonicalId: trainerId("banished-only-activatable"),
  name: "Banished Only Activatable",
  types: ["Generic", "Action"],
  cost: 0,
  defense: 3,
  abilities: [
    {
      id: `${trainerId("banished-only-activatable")}-a1`,
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["banished"],
      cost: { class: "asset", type: "resources", amount: 0 },
      text: "Instant — Draw a card. (Functional only while this is in your banished zone.)",
      effect: { type: "draw", count: 1, player: "controller" },
    },
  ],
};

describe("CR 5.2.4 — an activated ability's functionalZones gate its activation", () => {
  it("is activatable while its source is in the declared functional zone (banished)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, banished: [banishedOnlyActivatable], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const result = game.as(bravo).activate(banishedOnlyActivatable);
    expect(result.accepted).toBe(true);
  });

  it("is NOT activatable while its source is in a non-declared zone (hand)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [banishedOnlyActivatable], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const rejected = game
      .as(bravo)
      .expectActivationRejected(
        banishedOnlyActivatable,
        `${trainerId("banished-only-activatable")}-a1`,
      );
    expect(rejected.accepted).toBe(false);
  });
});
