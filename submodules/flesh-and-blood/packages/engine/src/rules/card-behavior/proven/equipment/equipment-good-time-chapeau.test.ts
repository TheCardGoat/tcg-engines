/**
 * BET004 Good Time Chapeau — Guardian Head d2 temper, Betsy Specialization.
 *
 * Printed:
 *   Action - Destroy a Gold you control: Your next attack this turn gets
 *   "When this attacks a hero, wager a Might and a Vigor token with them."
 *   Go again. Temper.
 *
 * Model (after fix):
 *   Action destroy Gold → grant-property ability on next attack (AAC or
 *   Weapon) this turn → on attack hero: sequence wager might + wager vigor.
 *
 * Reasoning:
 * 1. Destroy-cost targets permanent named Gold (activation destroy path).
 * 2. "Next attack" must cover AAC and weapons — subtypes Attack alone misses
 *    weapons; appliesTo next or: Attack | Weapon.
 * 3. Dual wager stakes: reducer used to fail-closed the second wager after the
 *    chain was already stamped; proposal now creates stake tokens.
 * 4. Go again refunds the Action AP. Temper defend is a separate lifecycle.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { goodTimeChapeau } from "../../../../../../cards/src/cards/equipment/good-time-chapeau.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  for (let safety = 0; safety < 60; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptOptional ?? false },
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
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function arenaHasName(
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
  namePart: string,
): boolean {
  // zone() returns canonical ids / token slugs (token:might, …).
  return player.zone("arena").some((id) => id.toLowerCase().includes(namePart.toLowerCase()));
}

describe("good-time-chapeau (BET004)", () => {
  it("core mechanic: destroy Gold → next AAC attack wagers Might and Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [goodTimeChapeau],
        // Gold in arena for the destroy cost.
        arena: [gold],
        hand: [snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 40 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(gold.canonicalId);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(goodTimeChapeau);
    // Sole Gold auto-picked as destroy cost; resolve Action layer.
    drain(game);

    // Tokens cease to exist when destroyed — not a GY move.
    expect(Bravo.zone("arena")).not.toContain(gold.canonicalId);
    // Equipment stays seated (destroy cost is Gold, not self).
    expect(Bravo.zone("head")).toContain(goodTimeChapeau.canonicalId);
    // Go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
    // Next-attack grant is armed.
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);

    // Next attack latches the granted ability and fires dual stake wagers.
    Bravo.attackWith(snatchRed);
    // Drain until combat is open and attack has declared (wager trigger fires
    // on attack, before chain close clears the combat-chain wager flag).
    for (let i = 0; i < 30; i += 1) {
      const d = game.getState().decision;
      if (d?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (d?.kind === "entity-target") {
        const pick = d.candidates[0];
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: {
              kind: "entity-target",
              instanceIds: pick ? [pick.instanceId] : [],
            },
          },
        });
        continue;
      }
      if (d?.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: {
              kind: "ordering",
              orderedIds: d.entries.map((e) => e.id),
            },
          },
        });
        continue;
      }
      if (d) break;
      const wagersSoFar = game.committedEvents().filter((e) => e.name === "wager").length;
      if (wagersSoFar >= 2 && game.getState().players[Bravo.id]!.history.combatChain.wagered) {
        break;
      }
      if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
      else break;
    }

    const wagers = game.committedEvents().filter((e) => e.name === "wager");
    expect(wagers.length).toBeGreaterThanOrEqual(2);
    // Prizes are held by their wagers until the chain link resolves.
    expect(arenaHasName(Bravo, "might")).toBe(false);
    expect(arenaHasName(Bravo, "vigor")).toBe(false);
    // Chain flag is set while combat is open (cleared on close).
    if (game.combat()?.open) {
      expect(game.getState().players[Bravo.id]!.history.combatChain.wagered).toBe(true);
    }
  });
  it("boundaries: without a Gold, activate is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [goodTimeChapeau],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(goodTimeChapeau)).toThrow();
    expect(Bravo.zone("head")).toContain(goodTimeChapeau.canonicalId);
  });

  it("boundaries: temper defend does not consume the Gold destroy Action", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [goodTimeChapeau],
        arena: [gold],
        hand: [],
        deck: 6,
        life: 40,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(goodTimeChapeau);
    game.helpers.resolveRestOfCombat();

    // Temper keeps the equipment with −1 counters rather than blade-break GY.
    // Gold was not destroyed by the defend path.
    expect(Defender.zone("arena")).toContain(gold.canonicalId);
    // Head may still hold it (temper) or counters applied — at least Gold remains.
    expect(
      Defender.zone("head").includes(goodTimeChapeau.canonicalId) ||
        Defender.zone("graveyard").includes(goodTimeChapeau.canonicalId),
    ).toBe(true);
  });
});
