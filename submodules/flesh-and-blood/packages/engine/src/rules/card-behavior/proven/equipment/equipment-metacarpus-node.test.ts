/**
 * CRU161 Metacarpus Node — Wizard Arms d0 Arcane Barrier 1.
 *
 * Printed:
 *   Whenever you play a card with an effect that deals arcane damage, you may
 *   pay {r}. If you do, instead it deals that much arcane damage plus 1, and
 *   destroy Metacarpus Node at the beginning of the end phase.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Play trigger actor:controller + hasStatus arcane-damage-effect (engine
 *    walks deal-damage/arcane ASTs). Prior hasKeyword English residue never
 *    matched.
 * 2. Optional pay 1{r} → register arcane damage +1 replacement this turn +
 *    delayed end-phase destroy of self.
 * 3. Replacement amount is damage count (+1), not card power.
 * 4. Happy: Zap Red (3 arcane, free) + accept → opponent −4; RP spent; delayed
 *    destroy armed (or node leaves at end phase).
 * 5. Boundary: decline optional → Zap deals 3; node stays; RP kept.
 * 6. Boundary: Snatch (no arcane effect) → no optional; node stays.
 * 7. AB1 keyword present (damage path not dual-exercised with this row).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { metacarpusNode } from "../../../../../../cards/src/cards/equipment/metacarpus-node.ts";
import { zapRed } from "../../../../../../cards/src/cards/actions/zap.ts";

const LIFE = 40;
const ZAP = 3;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 96; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      // Prefer opposing hero for "any-hero" arcane pings.
      const opp = decision.candidates.find((c) => c.instanceId !== decision.actorId);
      const pick = opp ?? decision.candidates[0];
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
    if (decision?.kind === "payment") {
      const pick = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
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

function finishStack(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  for (let safety = 0; safety < 96; safety += 1) {
    drain(game, opts);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio && !game.getState().decision) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    if (!game.getState().decision && !prio) return;
  }
}

describe("metacarpus-node (CRU161)", () => {
  it("core mechanic: play arcane card → pay {r} → damage +1; end-phase destroy armed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [metacarpusNode],
        hand: [zapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("arms")).toContain(metacarpusNode.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);

    Bravo.play(zapRed, { target: Opponent.id });
    finishStack(game, { acceptOptional: true });

    // Zap 3 + replacement 1 = 4 arcane to opponent; 1{r} paid.
    expect(Opponent.life()).toBe(LIFE - (ZAP + 1));
    expect(Bravo.resourcePoints()).toBe(0);
    // Delayed end-phase destroy of the node is registered, or node already GY.
    const delayed = game
      .getState()
      .delayedTriggers.some(
        (t) =>
          t.trigger.kind !== "state" &&
          !("patterns" in t.trigger.event) &&
          t.trigger.event.name === "end-phase",
      );
    const stillSeated = Bravo.zone("arms").includes(metacarpusNode.canonicalId);
    const inGy = Bravo.zone("graveyard").includes(metacarpusNode.canonicalId);
    expect(delayed || inGy).toBe(true);
    if (stillSeated) expect(delayed).toBe(true);
  });

  it("boundaries: decline; non-arcane play; model hasStatus + replacement count", () => {
    // Decline optional: Zap deals printed 3; node stays; RP kept.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        arms: [metacarpusNode],
        hand: [zapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    decline.as(bravo).play(zapRed, { target: decline.as(dash).id });
    finishStack(decline, { acceptOptional: false });
    expect(decline.as(dash).life()).toBe(LIFE - ZAP);
    expect(decline.as(bravo).zone("arms")).toContain(metacarpusNode.canonicalId);
    expect(decline.as(bravo).resourcePoints()).toBe(1);

    // Snatch has no arcane-damage effect — no optional, node stays.
    const snatch = FabTestEngine.start(
      {
        hero: bravo,
        arms: [metacarpusNode],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    snatch.as(bravo).attackWith(snatchRed);
    finishStack(snatch, { acceptOptional: true });
    expect(snatch.as(dash).life()).toBe(LIFE - 4);
    expect(snatch.as(bravo).zone("arms")).toContain(metacarpusNode.canonicalId);
    expect(snatch.as(bravo).resourcePoints()).toBe(1);

    const a1 = metacarpusNode.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "played-card",
            filter: { hasStatus: "arcane-damage-effect" },
          },
        },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "pay",
          cost: { type: "resources", amount: 1 },
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "replacement",
              replaces: { name: "damage", damageType: "arcane" },
              modification: {
                type: "modify-numeric",
                property: "count",
                op: "add",
                amount: 1,
              },
            },
            {
              type: "destroy",
              target: { selector: "self" },
              delay: "end-phase",
            },
          ],
        },
      });
    }
    expect(metacarpusNode.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "arcane-barrier", value: 1 })]),
    );
  });
});
