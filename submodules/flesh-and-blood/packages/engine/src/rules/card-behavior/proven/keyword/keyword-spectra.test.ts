/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:spectra
 * Representative card: packages/cards/src/cards/actions/shimmers-of-silver.ts
 * Canonical id: bjggdCWtfTmLNBzq8Jt9L
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
import { FabTestEngine, quoteFabAttackTargets } from "../../../../index.ts";
import { bravo, dash, shimmersOfSilverBlue, snatchRed } from "../../../fixtures.ts";

// Inline trainer permanents (same shape used by 08-keywords.test.ts spectra
// suite) so the spectra-destroyed-on-target behavior is exercised without
// depending on a specific catalog card's resolution abilities. The engine
// injects the spectra destroy-on-target rule from the keyword itself
// (rules/play/finalize.ts), so no explicit ability is required.
const spectraAuraTrainer = {
  canonicalId: "trainer-spectra-aura",
  types: ["Aura"],
  keywords: [{ name: "spectra" }],
  abilities: [],
};

describe("keyword: spectra", () => {
  it("AAA — Arrange: spectra aura in hand; Act: play it; Assert: enters arena as valid spectra attack target", () => {
    // Arrange — Shimmers of Silver Blue is an Illusionist Action Aura with spectra.
    // Cost 0, so no payment needed.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [shimmersOfSilverBlue], deck: 4 },
      { hero: dash, hand: [snatchRed], deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — play the spectra aura; it enters the arena.
    Bravo.play(shimmersOfSilverBlue);
    game.passBoth();

    // Assert — aura is in the arena (not graveyard).
    expect(Bravo.zone("arena")).toContain(shimmersOfSilverBlue.canonicalId);

    // Assert — the spectra aura is classified as a "spectra" attack target.
    const auraId = Bravo.findCardInZone("arena", shimmersOfSilverBlue);
    const Dash = game.as(dash);
    const attackInstanceId = Dash.findCardInZone("hand", snatchRed);
    const targets = quoteFabAttackTargets(game.getState(), {
      actorId: Dash.id,
      attackInstanceId,
    });
    expect(targets.candidates).toEqual(
      expect.arrayContaining([expect.objectContaining({ targetId: auraId, kind: "spectra" })]),
    );
  });

  it("AAA boundary — without spectra, a regular action card is not an attack target", () => {
    // Arrange — no spectra aura on the field, just heroes.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — check attack targets without any arena permanents.
    const attackInstanceId = Bravo.findCardInZone("hand", snatchRed);
    const targets = quoteFabAttackTargets(game.getState(), {
      actorId: Bravo.id,
      attackInstanceId,
    });

    // Assert — only the opposing hero is a valid target, no spectra candidates.
    const spectraTargets = targets.candidates.filter((c) => c.kind === "spectra");
    expect(spectraTargets).toHaveLength(0);
  });

  // ── CR 8.3.14b / 7.2.2c (C) / 7.7.2b ──────────────────────────────────────
  //
  // "Spectra is a keyword that means 'This can be attacked' and 'When this
  //  becomes the target of an attack, destroy this.' If a permanent with
  //  Spectra is the only target of an attack, it ceases to exist before the
  //  Attack Step and is no longer a legal attack-target, so the attack is
  //  cleared from the queue. If there are no other attacks in the queue, the
  //  combat chain closes." (CR 7.2.2c example)
  //
  // "legal attack-targets" means THIS attack's declared target(s), not every
  // attackable object in the arena. The opponent hero is NOT a fallback target
  // — the attacker declared the spectra permanent. When that sole declared
  // target is destroyed during finalizePlay (before the Attack Step), the
  // attack has no legal attack-target and is cleared; the combat chain closes.

  it("AAA — CR 8.3.14b / 7.2.2c (C) / 7.7.2b: a single-target attack on a spectra aura is cleared (no link forms against the destroyed aura); the combat chain closes and the defending hero takes no damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [spectraAuraTrainer], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const spectraId = Dash.findCardInZone("arena", spectraAuraTrainer);

    // Act — Bravo declares the spectra aura as the ONLY attack target.
    game.as(bravo).play(snatchRed, { target: spectraId });

    // CR 8.3.14b: the spectra aura is destroyed during finalizePlay, before the
    // Attack Step — it ceases to exist as a legal attack-target.
    expect(Dash.zone("arena")).not.toContain(spectraAuraTrainer.canonicalId);
    expect(Dash.zone("graveyard")).toContain(spectraAuraTrainer.canonicalId);

    // Resolve the just-played attack layer so the `attack` event reduces. CR
    // 7.2.2c (C) / 7.7.2b: because the sole declared target was destroyed, the
    // attack has no legal attack-target and is cleared — the link jumps STRAIGHT
    // to Resolution, never opening a Defend/Damage window against the destroyed
    // aura. (Under the old arena-wide target check this stayed at "attack",
    // forming a spurious defendable link against the dead aura.)
    game.passBoth();
    expect(game.combat()?.step).toBe("resolution");

    // After the dust settles the combat chain is closed and the defending hero
    // was never damaged (the attack never became attacking).
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expect(Dash.life()).toBe(20);
  });

  // Follow-up (not faked here): a negative case where a SECOND surviving
  // DECLARED target keeps the chain open. The engine's only multi-target path
  // is an additional-hero grant (e.g. Bolfar), which is not available with
  // these fixtures, so we do not fabricate it. See task-1.3-report.md.
});
