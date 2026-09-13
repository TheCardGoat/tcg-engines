/**
 * HVY008 Apex Bonebreaker — Brute Arms d2 Temper.
 *
 * Printed:
 *   When this defends together with a card with 6 or more {p}, create a Might
 *   token.
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case; tectonic-crust sibling):
 * 1. subject:self required — without it co-defender defend events match.
 * 2. togetherWith power gte 6 — Regurgitating Slog (p6) is a legal partner;
 *    Nimblism (no power) is not.
 * 3. Happy: defend with arms + Slog → Might in arena; Temper −1; stay equipped.
 * 4. Boundaries: alone / p4 partner → no Might; Temper; model subject:self.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, regurgitatingSlogRed } from "../../../fixtures.ts";
import { apexBonebreaker } from "../../../../../../cards/src/cards/equipment/apex-bonebreaker.ts";

const SNATCH = 4;
const LIFE = 20;

function hasMight(arenaIds: readonly string[]): boolean {
  return arenaIds.some((id) => /might|token:might/i.test(id));
}

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

describe("apex-bonebreaker (HVY008)", () => {
  it("core mechanic: defend together with p6+ card → Might token + Temper d2", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [apexBonebreaker],
        hand: [regurgitatingSlogRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // Slog p6 d2 — partner with 6+ {p}.
    Defender.defendWith([apexBonebreaker, regurgitatingSlogRed]);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    const mights = Defender.zone("arena").filter((id) => /might|token:might/i.test(id));
    expect(mights.length).toBe(1);
    // Arms stay (Temper −1, not bladeBreak).
    expect(Defender.zone("arms")).toContain(apexBonebreaker.canonicalId);
    const armsId = Defender.findCardInZone("arms", apexBonebreaker);
    expect(game.objectState(armsId)?.defenseCounterTotal).toBe(-1);
    // Block: d2 + slog d2 = 4 vs snatch 4.
    expect(Defender.life()).toBe(LIFE);
  });

  it("boundaries: alone / low-power partner → no Might; Temper; model subject:self", () => {
    // Alone.
    const alone = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [apexBonebreaker],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    alone.as(bravo).attackWith(snatchRed);
    alone.as(dash).defendWith(apexBonebreaker);
    drain(alone);
    alone.helpers.resolveRestOfCombat();

    expect(hasMight(alone.as(dash).zone("arena"))).toBe(false);
    expect(alone.as(dash).zone("arms")).toContain(apexBonebreaker.canonicalId);
    expect(alone.as(dash).life()).toBe(LIFE - (SNATCH - 2));
    const aloneId = alone.as(dash).findCardInZone("arms", apexBonebreaker);
    expect(alone.objectState(aloneId)?.defenseCounterTotal).toBe(-1);

    // Partner with no power (Nimblism blue d3) — not 6+ {p}.
    const low = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [apexBonebreaker],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    low.as(bravo).attackWith(snatchRed);
    low.as(dash).defendWith([apexBonebreaker, nimblismBlue]);
    drain(low);
    low.helpers.resolveRestOfCombat();
    drain(low);

    expect(hasMight(low.as(dash).zone("arena"))).toBe(false);

    // Snatch (p4) as co-defender — under 6 {p}.
    const p4 = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [apexBonebreaker],
        hand: [snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    p4.as(bravo).attackWith(snatchRed);
    p4.as(dash).defendWith([apexBonebreaker, snatchRed]);
    drain(p4);
    p4.helpers.resolveRestOfCombat();
    drain(p4);

    expect(hasMight(p4.as(dash).zone("arena"))).toBe(false);

    const a1 = apexBonebreaker.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.trigger) return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
        cohort: {
          kind: "together-with",
          filter: { power: { op: "gte", value: 6 } },
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "create-token",
      token: "might",
      controller: "controller",
    });
    expect(apexBonebreaker.base.keywords?.some((k) => k.name === "temper")).toBe(true);
  });
});
