/**
 * AAA test for trigger:gain-life.
 * Representative card: Verdance, Thorn of the Rose (ROS013).
 * With 8+ Earth in banished, may deal 1 arcane when gaining life during your turn.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, snatchRed, sigilOfSolaceRed } from "../../../fixtures.ts";
import { verdanceThornOfTheRose } from "../../../../../../cards/src/cards/heroes/verdance-thorn-of-the-rose.ts";
import { hypothermiaBlue } from "../../../fixtures.ts";

describe("trigger: gain-life", () => {
  it("AAA: Sigil of Solace gains life under Verdance with 8 Earth banished (ROS013)", () => {
    const earth = {
      ...hypothermiaBlue,
      base: {
        ...hypothermiaBlue.base,
        color: "blue" as const,
        typeBox: {
          ...hypothermiaBlue.base.typeBox,
          supertypes: ["Earth"] as const,
          types: ["Action"] as const,
          subtypes: ["Aura"] as const,
        },
      },
    };
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        hand: [sigilOfSolaceRed],
        banished: [earth, earth, earth, earth, earth, earth, earth, earth],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Verdance = game.as(verdanceThornOfTheRose);
    const lifeBefore = Verdance.life();

    Verdance.play(sigilOfSolaceRed);
    for (let i = 0; i < 12; i += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "boolean") {
        try {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: { accepted: true },
          });
        } catch {
          break;
        }
        continue;
      }
      if (!game.getState().decision && game.getState().rulesStack.length === 0) break;
      try {
        game.passBoth();
      } catch {
        break;
      }
    }

    // Life was gained (Sigil of Solace).
    expect(Verdance.life()).toBeGreaterThan(lifeBefore);
  });

  it("AAA boundary: without life-gain effect, life stays put on plain attack", () => {
    const game = FabTestEngine.start(
      { hero: verdanceThornOfTheRose, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Verdance = game.as(verdanceThornOfTheRose);
    const lifeBefore = Verdance.life();
    Verdance.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Verdance.life()).toBe(lifeBefore);
  });
});
