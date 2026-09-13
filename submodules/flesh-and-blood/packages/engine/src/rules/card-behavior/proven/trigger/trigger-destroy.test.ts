/**
 * AAA test for trigger:destroy.
 * Representative card: Halo of Lumina Light (APR003) — Light Illusionist Head Equipment.
 * Spellvoid 2 destroys this to prevent 2 arcane. When destroyed, optional yellow
 * aura from banished → arena.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, dash, snatchRed, volticBoltRed } from "../../../fixtures.ts";
import { haloOfLuminaLight } from "../../../../../../cards/src/cards/equipment/halo-of-lumina-light.ts";

describe("trigger: destroy", () => {
  it("AAA: spellvoid destroys Halo of Lumina on arcane damage (APR003)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [volticBoltRed], resourcePoints: 2, deck: 4 },
      {
        hero: dash,
        life: 20,
        head: [haloOfLuminaLight],
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Bravo.play(volticBoltRed, { target: Dash.id });
    for (let i = 0; i < 12; i += 1) {
      if (game.getState().rulesStack.length === 0 && !game.getState().decision) break;
      const decision = game.getState().decision;
      if (decision?.kind === "option" && decision.continuation.kind === "replacement-player") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "option", optionIds: decision.options.map((option) => option.id) },
          },
        });
        continue;
      }
      try {
        game.passBoth();
      } catch {
        break;
      }
    }

    // Halo destroyed by spellvoid; 5 arcane − 2 prevented = 3 → life 17.
    expect(Dash.zone("head")).not.toContain(haloOfLuminaLight.canonicalId);
    expectFabCard(Dash, haloOfLuminaLight).toBeIn("graveyard");
    expect(Dash.life()).toBe(17);
  });

  it("AAA boundary: physical combat does not destroy Halo via spellvoid", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, head: [haloOfLuminaLight], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("head")).toContain(haloOfLuminaLight.canonicalId);
    expect(Dash.life()).toBe(16);
  });
});
