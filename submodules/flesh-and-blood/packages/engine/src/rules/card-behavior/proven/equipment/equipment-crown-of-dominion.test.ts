/**
 * DYN234 Crown of Dominion — Generic Head (no defense).
 *
 * Printed:
 *   Your hero is Royal.
 *   When you equip Crown of Dominion, create a Gold token.
 *
 * Model (after fix):
 *   continuous grant-property supertype Royal → controller (hero)
 *   triggered equip subject:self → create-token gold
 *
 * Reasoning:
 * 1. "Your hero is Royal" is a continuous talent grant, not discrete set-status
 *    "royal" (which never reconciled as a continuous effect and did not match
 *    has-status "hero-is-royal" used by Imperial Ledger / suite).
 * 2. Equip trigger uses subject:self (name filter "Crown Of Dominion" was
 *    brittle vs printed "Crown of Dominion").
 * 3. Start-of-game seating fires start-of-game equip for equipment that
 *    listens for equip → Gold on match start.
 * 4. Without the crown, a non-Royal hero is not Royal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { crownOfDominion } from "../../../../../../cards/src/cards/equipment/crown-of-dominion.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function heroHasRoyal(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
  if (!heroId) return false;
  const record = state.objects[heroId];
  if (!record) return false;
  const view = buildFabRulesView(state);
  const hero = view.object({ instanceId: heroId, incarnation: record.incarnation });
  if (!hero) return false;
  return (
    hero.current.typeBox.supertypes.includes("Royal") ||
    (hero.current.typeBox.types as readonly string[]).includes("Royal")
  );
}

describe("crown-of-dominion (DYN234)", () => {
  it("core mechanic: equip at start → Gold token + hero is Royal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDominion],
        hand: [],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    drain(game);

    // Start-of-game equip → create Gold under controller.
    expect(Bravo.zone("arena").some((id) => /gold/i.test(id))).toBe(true);
    // Continuous Royal talent on the hero (object stage).
    expect(heroHasRoyal(game, Bravo.id)).toBe(true);
    // Crown remains equipped.
    expect(Bravo.zone("head")).toContain(crownOfDominion.canonicalId);
  });

  it("boundaries: without crown, non-Royal hero is not Royal and no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    drain(game);

    expect(Bravo.zone("arena").some((id) => /gold/i.test(id))).toBe(false);
    expect(heroHasRoyal(game, Bravo.id)).toBe(false);
  });

  it("boundaries: opponent without crown is not Royal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDominion],
        hand: [],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    drain(game);

    expect(heroHasRoyal(game, game.as(bravo).id)).toBe(true);
    expect(heroHasRoyal(game, game.as(dash).id)).toBe(false);
  });
});
