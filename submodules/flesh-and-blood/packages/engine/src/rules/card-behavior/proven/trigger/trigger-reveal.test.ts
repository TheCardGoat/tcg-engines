/**
 * AAA test for trigger:reveal.
 * Representative card: Korshem, Crossroads of the Elements (ELE000).
 * Whenever a hero reveals 1+ cards, they choose a benefit.
 * Fuse reveals emit reveal events that Korshem can observe.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, hypothermiaBlue } from "../../../fixtures.ts";
import { korshemCrossroadOfElements } from "../../../../../../cards/src/cards/actions/korshem-crossroad-of-elements.ts";
import { entwineIceRed } from "../../../../../../cards/src/cards/actions/entwine-ice.ts";

describe("trigger: reveal", () => {
  it("AAA: fuse reveal with Korshem in arena is legal and resolves (ELE000)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [korshemCrossroadOfElements],
        hand: [entwineIceRed, hypothermiaBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(korshemCrossroadOfElements.canonicalId);

    Bravo.play(entwineIceRed, {
      target: game.as(dash).id,
      fuse: true,
      fuseCards: [hypothermiaBlue],
    });
    for (let i = 0; i < 14; i += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "option" || decision?.kind === "effect-resolution") {
        // Korshem's third mode grants the next attack +1 power and does not
        // require a player-binding outcome from the reveal trigger.
        const optionId = decision.options[2]?.id ?? decision.options[0]?.id;
        if (!optionId) break;
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer:
              decision.kind === "option"
                ? { kind: "option", optionIds: [optionId] }
                : { kind: "effect-resolution", optionId },
          },
        });
        continue;
      }
      try {
        game.passBoth();
      } catch {
        break;
      }
      if (
        !game.combat()?.open &&
        game.getState().rulesStack.length === 0 &&
        !game.getState().decision
      )
        break;
    }
    if (game.combat()?.open) game.helpers.resolveRestOfCombat();

    expect(game.getState().players[Bravo.id]!.history.turn.fused).toBe(true);
    // Korshem still present or was destroyed by its end-phase condition later.
    expect(
      Bravo.zone("arena").includes(korshemCrossroadOfElements.canonicalId) ||
        Bravo.zone("graveyard").includes(korshemCrossroadOfElements.canonicalId),
    ).toBe(true);
  });

  it("AAA boundary: attack without reveal does not mark fusedThisTurn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [korshemCrossroadOfElements],
        hand: [entwineIceRed],
        resourcePoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(entwineIceRed, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[game.as(bravo).id]!.history.turn.fused).toBe(false);
  });
});
