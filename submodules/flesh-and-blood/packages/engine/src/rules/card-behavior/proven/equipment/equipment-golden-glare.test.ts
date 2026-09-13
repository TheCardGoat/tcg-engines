/**
 * HVY054 Golden Glare — Guardian Head d2 Blade Break, Victor Specialization.
 *
 * Printed:
 *   When this defends together with 2 or more yellow cards, create a Gold token.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. defend + togetherWith yellow + togetherWithCount gte 2 partners (excluding
 *    self) → create-token gold.
 * 2. Fewer than 2 yellow co-defenders → no Gold.
 * 3. Blade Break after defend → GY; d2 contribution.
 * 4. subject not required when trigger is on this equipment's defend event.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, packHuntYellow, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { goldenGlare } from "../../../../../../cards/src/cards/equipment/golden-glare.ts";

const SNATCH = 4;
const LIFE = 20;

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

describe("golden-glare (HVY054)", () => {
  it("core mechanic: defend with 2 yellow → Gold token + BB d2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [goldenGlare],
        hand: [packHuntYellow, tomeOfFyendalYellow],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith([goldenGlare, packHuntYellow, tomeOfFyendalYellow]);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − d2 helm − pack hunt? pack hunt and bauble also have defense.
    // We assert Gold + BB rather than exact damage math from multi-defenders.
    expect(Defender.zone("arena").some((id) => /token:gold/i.test(id))).toBe(true);
    expect(Defender.zone("graveyard")).toContain(goldenGlare.canonicalId);
    expect(Defender.zone("head")).not.toContain(goldenGlare.canonicalId);
  });

  it("boundaries: fewer than 2 yellow co-defenders → no Gold; BB still", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [goldenGlare],
        hand: [packHuntYellow],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith([goldenGlare, packHuntYellow]);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("arena").some((id) => /token:gold/i.test(id))).toBe(false);
    expect(Defender.zone("graveyard")).toContain(goldenGlare.canonicalId);

    // Solo helm defend: BB d2, no gold.
    const game2 = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [goldenGlare],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game2.as(bravo).attackWith(snatchRed);
    game2.as(dash).defendWith(goldenGlare);
    drain(game2);
    game2.helpers.resolveRestOfCombat();
    expect(game2.as(dash).life()).toBe(LIFE - (SNATCH - 2));
    expect(
      game2
        .as(dash)
        .zone("arena")
        .some((id) => /token:gold/i.test(id)),
    ).toBe(false);

    const a1 = goldenGlare.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered" || a1.resolution.kind !== "effect")
      return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        cohort: {
          kind: "together-with",
          filter: { color: ["yellow"] },
          count: { op: "gte", value: 2 },
        },
      },
    });
    expect(a1.resolution.effect).toMatchObject({
      type: "create-token",
      token: "gold",
      controller: "controller",
    });
  });
});
