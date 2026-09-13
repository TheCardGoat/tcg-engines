/**
 * PEN191 Vestige of Flagellation — Shadow Chest d2 Blade Break.
 *
 * Printed:
 *   The first time an opponent would gain {h} each turn, instead you lose
 *   that much and create that many Vigor tokens.
 *   Blade Break
 *
 * Reasoning (case-by-case; no batch script):
 * 1. Continuous replacement on opponent gain-life (was name:"gain" which is
 *    power-gain residue — never matched gain-life events).
 * 2. ENGINE: support gain-life + player:opponent pattern; apply cancels
 *    opponent gain, emits controller lose-life + N Vigor creates; limit 1/turn
 *    via consumedStaticReplacementIds (stamp on lose-life).
 * 3. Second opponent gain same turn is not rewritten.
 * 4. Blade Break d2 when defended.
 *
 * Status: ✅ first opp {h} → you lose + Vigor; second gain; BB d2; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, sigilOfSolaceRed } from "../../../fixtures.ts";
import { vestigeOfFlagellation } from "../../../../../../cards/src/cards/equipment/vestige-of-flagellation.ts";
import { vigor } from "../../../../../../cards/src/cards/tokens/vigor.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;
const SIGIL_GAIN = 3;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
    if (decision?.kind === "option") {
      const decline =
        decision.options.find((option) => option.id === "decline") ?? decision.options[0];
      if (!decline) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: [decline.id] },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
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

function vigorCount(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const state = game.getState();
  return (state.containers.zonesByPlayerId[playerId]?.arena ?? []).filter((id) => {
    const canonical = state.objects[id]?.canonicalId ?? "";
    return (
      canonical === vigor.canonicalId || canonical === "token:vigor" || /vigor/i.test(canonical)
    );
  }).length;
}

describe("vestige-of-flagellation (PEN191)", () => {
  it("core mechanic: first opponent {h} gain → you lose that much + create that many Vigor", () => {
    // Vestige controller is dash (chest). Bravo plays Sigil of Solace for +3{h}.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sigilOfSolaceRed],
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [vestigeOfFlagellation],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Gainer = game.as(bravo);
    const Vestige = game.as(dash);

    expect(Gainer.life()).toBe(LIFE);
    expect(Vestige.life()).toBe(LIFE);
    expect(vigorCount(game, Vestige.id)).toBe(0);

    Gainer.play(sigilOfSolaceRed);
    drain(game);

    // Opponent does NOT gain 3; vestige controller loses 3 and gets 3 Vigor.
    expect(Gainer.life()).toBe(LIFE);
    expect(Vestige.life()).toBe(LIFE - SIGIL_GAIN);
    expect(vigorCount(game, Vestige.id)).toBe(SIGIL_GAIN);
  });

  it("boundaries: second gain same turn not rewritten; BB d2; model gain-life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sigilOfSolaceRed, sigilOfSolaceRed],
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [vestigeOfFlagellation],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Gainer = game.as(bravo);
    const Vestige = game.as(dash);

    Gainer.play(sigilOfSolaceRed);
    drain(game);
    expect(Gainer.life()).toBe(LIFE);
    expect(Vestige.life()).toBe(LIFE - SIGIL_GAIN);
    expect(vigorCount(game, Vestige.id)).toBe(SIGIL_GAIN);

    // Second Sigil same turn: first-time limit already spent → normal gain.
    Gainer.play(sigilOfSolaceRed);
    drain(game);
    expect(Gainer.life()).toBe(LIFE + SIGIL_GAIN);
    expect(Vestige.life()).toBe(LIFE - SIGIL_GAIN);
    expect(vigorCount(game, Vestige.id)).toBe(SIGIL_GAIN);

    // Blade Break d2.
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [vestigeOfFlagellation],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(vestigeOfFlagellation);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bb.as(dash).zone("chest")).not.toContain(vestigeOfFlagellation.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(vestigeOfFlagellation.canonicalId);

    const a1 = vestigeOfFlagellation.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.effect).toMatchObject({
      type: "replacement",
      replacementKind: "standard",
      replaces: { name: "gain-life", player: "opponent" },
      limit: { count: 1, per: "turn" },
      duration: "while-in-arena",
    });
    if (a1.effect.type !== "replacement" || a1.effect.modification.type !== "sequence") return;
    expect(a1.effect.modification.steps[0]).toMatchObject({
      type: "lose-life",
      amount: { type: "event-amount" },
      target: { selector: "controller" },
    });
    expect(a1.effect.modification.steps[1]).toMatchObject({
      type: "create-token",
      token: "vigor",
      controller: "controller",
      count: { type: "event-amount" },
    });
    expect(vestigeOfFlagellation.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(vestigeOfFlagellation.base.numeric.defense).toBe(2);
  });
});
