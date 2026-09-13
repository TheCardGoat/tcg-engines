/**
 * MON187 Carrion Husk — Shadow Chest d6 Blood Debt.
 *
 * Printed:
 *   If you defend with Carrion Husk, banish it when the combat chain closes.
 *   At the start of your turn, if you have 13 or less {h}, banish Carrion Husk.
 *   Blood Debt
 *
 * Reasoning (case-by-case):
 * 1. a1 was continuous + hasStatus defended-with-this + nested delayed-trigger —
 *    not executable as continuous. Remodelled to defend subject:self → delayed
 *    combat-chain-close → banish self (Ironhide executable shape).
 * 2. Defend contributes d6; chain close banishes to banished (not GY).
 * 3. a2: start of your turn with life ≤ 13 banishes; life ≥ 14 stays.
 * 4. Blood Debt: after defend-banish, end-phase loses 1{h} while face-up banished.
 *
 * Status: ✅ defend→chain-close banish; start-turn life gate; Blood Debt tick; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { carrionHusk } from "../../../../../../cards/src/cards/equipment/carrion-husk.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
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

function endTurnDrain(game: ReturnType<typeof FabTestEngine.start>, hero: typeof bravo): void {
  game.as(hero).endTurn();
  for (let safety = 0; safety < 32; safety += 1) {
    const d = game.getState().decision;
    if (d) {
      if (d.kind === "boolean") {
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
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
      try {
        game.passBoth();
      } catch {
        break;
      }
      continue;
    }
    break;
  }
}

describe("carrion-husk (MON187)", () => {
  it("core mechanic: defend d6 → combat chain close banishes to banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [carrionHusk],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(carrionHusk);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Snatch 4 − d6 = 0 damage.
    expect(Defender.life()).toBe(LIFE);
    expect(Defender.zone("chest")).not.toContain(carrionHusk.canonicalId);
    expect(Defender.zone("banished")).toContain(carrionHusk.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(carrionHusk.canonicalId);
  });

  it("core interaction: after defend-banish, Blood Debt ticks 1{h} at owner's end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [carrionHusk],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(carrionHusk);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Defender.zone("banished")).toContain(carrionHusk.canonicalId);

    // Blood debt ticks at the beginning of the debt owner's end phase (CR 8.3.11).
    endTurnDrain(game, bravo);
    endTurnDrain(game, dash);
    expect(Defender.life()).toBe(LIFE - 1);
  });

  it("core mechanic: start of turn with life ≤ 13 banishes Carrion Husk", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 13,
        chest: [carrionHusk],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Cycle to Dash's second start phase (first start already passed at seat).
    endTurnDrain(game, dash);
    endTurnDrain(game, bravo);
    drain(game);

    expect(Dash.zone("chest")).not.toContain(carrionHusk.canonicalId);
    expect(Dash.zone("banished")).toContain(carrionHusk.canonicalId);
  });

  it("boundaries: start of turn with life ≥ 14 keeps Carrion Husk equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 14,
        chest: [carrionHusk],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    endTurnDrain(game, dash);
    endTurnDrain(game, bravo);
    drain(game);

    expect(Dash.zone("chest")).toContain(carrionHusk.canonicalId);
    expect(Dash.zone("banished")).not.toContain(carrionHusk.canonicalId);
  });

  it("model guard: defend→delayed chain-close banish; start-phase life≤13 banish; bloodDebt", () => {
    const a1 = carrionHusk.base.abilities?.[0];
    const a2 = carrionHusk.base.abilities?.[1];
    expect(a1?.kind).toBe("static");
    expect(a2?.kind).toBe("static");
    if (a1?.kind !== "static" || a2?.kind !== "static" || !a1.effect || !a2.effect) return;

    expect(a1.trigger).toMatchObject({
      event: { name: "defend", subject: "self" },
    });
    expect(a1.effect).toMatchObject({
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "combat-chain-close",
          actor: {
            kind: "none",
          },
          observes: {
            kind: "none",
          },
        },
      },
      policy: {
        kind: "windowed",
        duration: "this-combat-chain",
        matching: "first",
      },
      resolution: {
        kind: "effect",
        effect: { type: "banish", target: { selector: "self" } },
      },
    });

    expect(a2.trigger).toMatchObject({ event: { name: "start-phase" } });
    expect(a2.condition).toMatchObject({
      type: "life-comparison",
      player: "self",
      vs: "fixed",
      op: "lte",
      value: 13,
    });
    expect(a2.effect).toMatchObject({
      type: "banish",
      target: { selector: "self" },
    });
    expect(carrionHusk.base.keywords?.some((k) => k.name === "blood-debt")).toBe(true);
    expect(carrionHusk.base.numeric.defense).toBe(6);
  });
});
