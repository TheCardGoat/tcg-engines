/**
 * AAA test for effect:modify-numeric (appliesTo: next) + create-token.
 * Representative card: Lead with Heart Blue (HVY194) — Guardian/Warrior Action.
 * Cost 1, pitch 3, defense 2, go again.
 * a1: "Your next Guardian or Warrior attack this turn gets +1{p}."
 *   → modify-numeric { power +1, target: this-attack, appliesTo: next Guardian|Warrior }
 * a2: "Create a Vigor token."
 *   → create-token { token: vigor, controller: controller }
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, leadWithHeartBlue, faultLineRed } from "../../../fixtures.ts";

describe("effect: modify-numeric appliesTo:next + create-token (Lead with Heart Blue)", () => {
  it("AAA: playing Lead with Heart creates a Vigor token in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [leadWithHeartBlue], resourcePoints: 1, deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: true, autoPitch: true },
    );
    const Bravo = game.as(bravo);

    Bravo.play(leadWithHeartBlue);

    // Vigor token appears in the arena from the create-token effect.
    const arena = Bravo.zone("arena");
    expect(arena.some((id) => id.toLowerCase().includes("vigor"))).toBe(true);
  });

  it("AAA: the next Guardian attack gets +1 power from the buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leadWithHeartBlue, faultLineRed],
        resourcePoints: 4,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Play Lead with Heart first (cost 1, go again) — sets the +1 power buff.
    Bravo.play(leadWithHeartBlue);
    // Drain the chain link so the attack can be played next.
    game.passBoth();

    // Attack with the Guardian attack (cost 3, base power 7).
    Bravo.attackWith(faultLineRed);

    // Fault Line Red base power 7 + Lead with Heart +1 = 8.
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("AAA boundary: without Lead with Heart, Guardian attack has base power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [faultLineRed],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(faultLineRed);

    // Fault Line Red base power 7, no buff.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });
});
