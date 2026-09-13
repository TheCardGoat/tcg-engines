/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:protect
 * Representative card: packages/cards/src/cards/heroes/reya-the-unyielding.ts
 * Canonical id: KnwNm8LC9DNpT8wMzDnFn
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
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, snatchRed, cintariSellsword } from "../../../fixtures.ts";
import { reyaTheUnyielding } from "../../../../../../cards/src/cards/heroes/reya-the-unyielding.ts";
import { bastionOfDuty } from "../../../../../../cards/src/cards/equipment/bastion-of-duty.ts";

describe("trigger: protect", () => {
  it("AAA: Reya the Unyielding creates a Gold token when protecting an ally (SMP005)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: reyaTheUnyielding,
        life: 21,
        weapon2: [bastionOfDuty],
        arena: [cintariSellsword],
        deck: 6,
      },
      // Walks priority/pitch timing by hand — opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Reya = game.as(reyaTheUnyielding);
    const allyId = Reya.findCardInZone("arena", cintariSellsword);
    const eqId = Reya.findCardInZone("weapon2", bastionOfDuty);

    // Act — Bravo attacks Reya's ally; Reya defends with Bastion of Duty
    // (which has protect), triggering the protect event → Reya's static
    // "Whenever you protect another hero, create a Gold token."
    Bravo.attackWith(snatchRed, { target: allyId });
    expect(game.combat()?.step).toBe("defend");
    Reya.exec({ move: "defend", payload: { instanceIds: [eqId] } });

    // Resolve the triggered layer + rest of combat.
    game.helpers.resolveRestOfCombat();

    // Assert — a Gold token was created in Reya's arena. (The ally dies from
    // the attack damage, so arena count may not increase — assert the token
    // presence directly.)
    expect(Reya.zone("arena").some((id) => /token:gold/i.test(id))).toBe(true);
  });

  it("AAA boundary: no Gold token when defending the hero directly (not protecting)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: reyaTheUnyielding,
        life: 21,
        weapon2: [bastionOfDuty],
        deck: 6,
      },
      // Walks priority/pitch timing by hand — opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Reya = game.as(reyaTheUnyielding);
    const eqId = Reya.findCardInZone("weapon2", bastionOfDuty);
    const arenaBefore = Reya.zone("arena").length;

    // Bravo attacks Reya's hero (not an ally). Defending with a protect card
    // is normal defense — no protect event fires.
    game.as(bravo).attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Reya.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();

    // Assert — no Gold token created.
    expect(Reya.zone("arena").length).toBe(arenaBefore);
    expect(Reya.zone("arena").some((id) => /token:gold/i.test(id))).toBe(false);
  });
});
