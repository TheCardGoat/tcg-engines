/**
 * AAA test for trigger:become.
 * Representative card: Arakni, Trap Door (HNT008) — Chaos Assassin Demi-Hero.
 * "When you become this" is an observation event; seating as the demi-hero
 * establishes the identity that would listen for become. Search/banish is
 * optional and only fires when a become event is emitted mid-game.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { arakniTrapDoor } from "../../../../../../cards/src/cards/demi-heroes/arakni-trap-door.ts";

describe("trigger: become", () => {
  it("AAA: Arakni Trap Door seats as demi-hero and is rules-reachable (HNT008)", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniTrapDoor,
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniTrapDoor);
    // Demi-hero identity is seated — the become subscriber is live on this object.
    expect(Arakni.zone("heroZone")).toContain(arakniTrapDoor.canonicalId);
    expect(Arakni.hero()).toBe(arakniTrapDoor.canonicalId);

    // Combat proves the seated demi-hero is a legal attack controller.
    Arakni.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("AAA boundary: Bravo is not Arakni Trap Door", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).zone("heroZone")).toContain(bravo.canonicalId);
    expect(game.as(bravo).zone("heroZone")).not.toContain(arakniTrapDoor.canonicalId);
  });
});
