/**
 * OMN141 Plutonic Starplate — Lightning Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   The first time you play a Lightning card during each of your opponent's
 *   turns, gain {r}.
 *   Arcane Barrier 1
 *
 * Reasoning (case-by-case):
 * 1. Opponent's turn + you play Lightning Instant → +1{r} once per turn.
 * 2. Your turn Lightning play does not fire (turn-player opponent gate).
 * 3. Second Lightning same opponent turn does not double-dip (limit 1/turn).
 * 4. Non-Lightning Instant on opponent turn does not invent RP.
 * 5. Model fixes: types Lightning (not supertypes-only), actor controller,
 *    single AB1 (was duplicated keyword).
 *
 * Status: ✅ opponent-turn first Lightning → +1{r}; own-turn/2nd/non-L; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { plutonicStarplate } from "../../../../../../cards/src/cards/equipment/plutonic-starplate.ts";
import { electrostaticDischargeRed } from "../../../../../../cards/src/cards/instants/electrostatic-discharge.ts";
import { homageToAncestorsBlue } from "../../../../../../cards/src/cards/instants/homage-to-ancestors.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("plutonic-starplate (OMN141)", () => {
  it("core mechanic: first Lightning you play on opponent's turn → +1{r}", () => {
    // Dash is turn player (attacks); Bravo plays Lightning Instant at defend priority.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        life: 40,
        chest: [plutonicStarplate],
        // Two free Lightning Instants: first gains {r}; second proves limit.
        hand: [electrostaticDischargeRed, electrostaticDischargeRed],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Bravo = game.as(bravo);

    expect(game.getState().activePlayerId).toBe(Attacker.id);
    expect(Bravo.resourcePoints()).toBe(0);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Bravo.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Bravo.id);

    // First Lightning Instant on opponent's turn.
    Bravo.play(electrostaticDischargeRed);
    drain(game);
    expect(Bravo.resourcePoints()).toBe(1);

    // Second Lightning same opponent turn via a fresh chain link.
    if (game.combat()) {
      drain(game);
      game.helpers.resolveRestOfCombat();
    }
    Attacker.attackWith(snatchRed);
    Bravo.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Bravo.id);
    Bravo.play(electrostaticDischargeRed);
    drain(game);
    expect(Bravo.resourcePoints()).toBe(1);

    drain(game);
    game.helpers.resolveRestOfCombat();
  });

  it("boundaries: own-turn Lightning no gain; non-Lightning opponent-turn no gain; model", () => {
    // Own turn: Lightning Instant does not fire the opponent-turn gate.
    const ownTurn = FabTestEngine.start(
      {
        hero: bravo,
        chest: [plutonicStarplate],
        hand: [electrostaticDischargeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    ownTurn.as(bravo).play(electrostaticDischargeRed);
    drain(ownTurn);
    expect(ownTurn.as(bravo).resourcePoints()).toBe(0);

    // Opponent turn + non-Lightning Instant (Homage) does not invent {r}.
    const nonL = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        chest: [plutonicStarplate],
        hand: [homageToAncestorsBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    nonL.as(dash).attackWith(snatchRed);
    nonL.as(bravo).defendWith([]);
    nonL.as(dash).pass();
    expect(nonL.getState().priority?.holderPlayerId).toBe(nonL.as(bravo).id);
    nonL.as(bravo).play(homageToAncestorsBlue);
    drain(nonL);
    expect(nonL.as(bravo).resourcePoints()).toBe(0);
    nonL.helpers.resolveRestOfCombat();

    const a1 = plutonicStarplate.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static" && a1.staticKind === "triggered") {
      expect(a1.trigger).toMatchObject({
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: { typeBox: { supertypes: ["Lightning"] } },
          },
        },
      });
      expect(a1.trigger.kind === "event-and-state" ? a1.trigger.state : undefined).toMatchObject({
        type: "turn-player",
        who: "opponent",
      });
      expect(a1.limit).toMatchObject({ count: 1, per: "turn" });
      expect(a1.resolution.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
        type: "gain-resources",
        amount: 1,
      });
    }
    expect(
      plutonicStarplate.base.keywords?.filter((k) => k.name === "arcane-barrier"),
    ).toHaveLength(1);
    expect(plutonicStarplate.base.numeric.defense).toBe(0);
  });
});
