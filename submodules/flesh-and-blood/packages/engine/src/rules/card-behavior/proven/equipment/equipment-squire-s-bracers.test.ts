/**
 * DDD005 Squire's Bracers — Warrior Arms d0.
 *
 * Printed:
 *   When your sword attack hits, you may destroy this. If you do, the sword's
 *   next attack this turn gets +2{p}.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Hit trigger actor:controller + subtypes Sword (Sword is FAB_SUBTYPES).
 * 2. Optional destroy-self → floating +2{p} appliesTo.next Sword this turn.
 * 3. Dual 1H swords (Hot Streak + Parry Blade): first hits → accept destroy;
 *    second deals base 2+2=4. Dawnblade is 2H OPT and cannot fire "next" alone.
 * 4. Boundary: decline optional → bracers stay; second sword still base 2.
 * 5. Boundary: Snatch (AAC) hit does not fire Sword filter; bracers stay.
 * 6. Model: hit Sword + optional destroy + appliesTo next Sword +2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { squireSBracers } from "../../../../../../cards/src/cards/equipment/squire-s-bracers.ts";
import { hotStreak } from "../../../../../../cards/src/cards/weapons/hot-streak.ts";
import { parryBlade } from "../../../../../../cards/src/cards/equipment/parry-blade.ts";

const LIFE = 40;
const HOT = 2;
const PARRY = 2;
const BUFF = 2;

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

function finishCombat(
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

describe("squire-s-bracers (DDD005)", () => {
  it("core mechanic: sword hit → destroy → next sword attack +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [squireSBracers],
        // Two distinct 1H swords so "next attack this turn" is reachable after OPT.
        weapon1: [hotStreak],
        weapon2: [parryBlade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("arms")).toContain(squireSBracers.canonicalId);

    // First sword hits for base 2; accept optional destroy on bracers.
    Bravo.activate(hotStreak);
    finishCombat(game, { acceptOptional: true });
    expect(Opponent.life()).toBe(LIFE - HOT);
    expect(Bravo.zone("graveyard")).toContain(squireSBracers.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(squireSBracers.canonicalId);

    // Second sword is the "next sword attack" → +2.
    Bravo.activate(parryBlade);
    finishCombat(game, { acceptOptional: true });
    expect(Opponent.life()).toBe(LIFE - HOT - (PARRY + BUFF));
  });

  it("boundaries: decline keeps arms; AAC hit no fire; model hit Sword optional + next", () => {
    // Decline: first sword hits; bracers stay; second sword still base 2.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        arms: [squireSBracers],
        weapon1: [hotStreak],
        weapon2: [parryBlade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    decline.as(bravo).activate(hotStreak);
    finishCombat(decline, { acceptOptional: false });
    expect(decline.as(dash).life()).toBe(LIFE - HOT);
    expect(decline.as(bravo).zone("arms")).toContain(squireSBracers.canonicalId);

    decline.as(bravo).activate(parryBlade);
    finishCombat(decline, { acceptOptional: false });
    expect(decline.as(dash).life()).toBe(LIFE - HOT - PARRY);
    expect(decline.as(bravo).zone("arms")).toContain(squireSBracers.canonicalId);

    // AAC Snatch is not a sword attack — no optional, arms stay.
    const aac = FabTestEngine.start(
      {
        hero: bravo,
        arms: [squireSBracers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    aac.as(bravo).attackWith(snatchRed);
    finishCombat(aac, { acceptOptional: true });
    expect(aac.as(dash).life()).toBe(LIFE - 4);
    expect(aac.as(bravo).zone("arms")).toContain(squireSBracers.canonicalId);

    const a1 = squireSBracers.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "attack",
            filter: { typeBox: { subtypes: ["Sword"] } },
          },
        },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "destroy",
          target: { selector: "self" },
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
          },
        },
      });
    }
  });
});
