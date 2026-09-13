/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:universal
 * Representative card: packages/cards/src/cards/actions/wage-gold.ts
 * Canonical id: PQJbFn9m8g7J6BttmD6LN
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, buildFabRulesView } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("keyword: universal", () => {
  it("AAA — Arrange: universal attack card in Bravo (Guardian) hand; Act: inspect typeBox and play the attack; Assert: card inherits Guardian supertype and deals damage", () => {
    const uni = hitTrainer({
      slug: "universal-atk",
      keywords: [{ name: "universal" }],
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [uni], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(bravo).findCardInZone("hand", uni);
    const record = game.getState().objects[id]!;
    const card = buildFabRulesView(game.getState()).object({
      instanceId: id,
      incarnation: record.incarnation,
    });
    expect(card?.current.typeBox.supertypes).toContain("Guardian");
    // Confirm the static effect is live.
    const universalEffect = game
      .getState()
      .continuousEffectInstances.find(
        (effect) => effect.origin === "static" && effect.abilityId === "intrinsic-universal",
      );
    expect(universalEffect).toBeDefined();
    // Play the attack and verify damage.
    game.as(bravo).attackWith(uni);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("AAA — boundary: non-universal card does not inherit hero class supertype", () => {
    const plain = hitTrainer({ slug: "non-uni", keywords: [], power: 4 });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [plain], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(bravo).findCardInZone("hand", plain);
    const record = game.getState().objects[id]!;
    const card = buildFabRulesView(game.getState()).object({
      instanceId: id,
      incarnation: record.incarnation,
    });
    expect(card?.current.typeBox.supertypes).not.toContain("Guardian");
    expect(
      game
        .getState()
        .continuousEffectInstances.some(
          (effect) => effect.origin === "static" && effect.abilityId === "intrinsic-universal",
        ),
    ).toBe(false);
  });
});
