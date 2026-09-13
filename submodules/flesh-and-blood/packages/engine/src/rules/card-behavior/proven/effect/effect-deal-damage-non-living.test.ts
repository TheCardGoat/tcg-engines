/**
 * CR 8.5.3c: If a non-living object would be dealt damage, the effect fails.
 *
 * A non-living object is one whose evaluated `current.numeric.life` is
 * undefined (e.g. an Aura / Figment permanent). The damage proposal must not
 * emit a `deal-damage` event for it.
 *
 * Enforcement is layered: objectTargets zone-matching already excludes
 * non-living permanents from standard damage targeting, AND proposeDealDamage
 * carries a defense-in-depth liveness gate (skip targets with undefined life)
 * so 8.5.3c holds even if a non-living object reaches proposal via a binding
 * or future target path. These tests lock the end-to-end behavior so a
 * regression in EITHER layer fails here.
 *
 * Non-living target: a Figment (Illusionist Aura) permanent. Living regression
 * target: a Cintari Sellsword ally (life 2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import type { FabFixtureCardEntry } from "../../../../testing/test-fixtures.ts";
import { bravo, cintariSellsword, dash } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

/** A non-living arena permanent: an Illusionist Aura Figment with no life. */
const nonLivingFigment: FabFixtureCardEntry = (() => {
  const canonicalId = "trainer-nonliving-figment";
  const face = (side: "front" | "back", name: string) => ({
    faceId: `${canonicalId}:face:${side}`,
    name,
    typeText: "Illusionist Aura - Figment",
    types: ["Illusionist", "Aura", "Figment"],
    traits: [],
    text: "",
    keywords: [],
    abilities: [],
  });
  return {
    canonicalId,
    name: "Non-Living Figment",
    types: ["Illusionist", "Aura", "Figment"],
    layout: {
      kind: "flip",
      family: "figment",
      front: face("front", "Non-Living Figment"),
      back: face("back", "Non-Living Figment Awakened"),
    },
  };
})();

const dealToOpponentPermanent = (amount: number) => ({
  type: "deal-damage" as const,
  damageType: "generic" as const,
  amount,
  target: {
    selector: "object" as const,
    declared: "at-resolution" as const,
    player: "opponent" as const,
    zones: ["permanent" as const],
    count: 1,
  },
});

describe("effect: deal-damage — CR 8.5.3c non-living target fails", () => {
  it("emits no deal-damage event for a non-living Figment permanent", () => {
    const attack = hitTrainer({
      slug: "fx-deal-damage-non-living",
      power: 4,
      effect: dealToOpponentPermanent(3),
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4, resourcePoints: 0 },
      { hero: dash, arena: [nonLivingFigment], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.3c: the effect failed for the non-living Figment, so no
    // deal-damage event references it (matched by canonicalId).
    const dealtToNonLiving = game
      .committedEvents()
      .some(
        (event) =>
          event.name === "deal-damage" &&
          typeof event.data.target === "object" &&
          "canonicalId" in event.data.target &&
          event.data.target.canonicalId === nonLivingFigment.canonicalId,
      );
    expect(dealtToNonLiving).toBe(false);
  });

  it("still damages a living ally target (regression guard)", () => {
    const attack = hitTrainer({
      slug: "fx-deal-damage-living-ally",
      power: 4,
      effect: dealToOpponentPermanent(2),
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4 },
      { hero: dash, arena: [cintariSellsword], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // A living ally (Cintari Sellsword, life 2) receives the damage event.
    const dealtToAlly = game
      .committedEvents()
      .some(
        (event) =>
          event.name === "deal-damage" &&
          typeof event.data.target === "object" &&
          "canonicalId" in event.data.target &&
          event.data.target.canonicalId === cintariSellsword.canonicalId,
      );
    expect(dealtToAlly).toBe(true);
  });
});
