/**
 * EVR037 Mask of the Pouncing Lynx — Ninja Head d2 Blade Break.
 *
 * Printed:
 *   When an attack action card you control hits, you may destroy Mask of the
 *   Pouncing Lynx. If you do, search your deck for an attack action card with
 *   2 or less {p}, banish it, then shuffle. You may play it this turn.
 *   Blade Break
 *
 * Reasoning (case-by-case):
 * 1. Optional destroy must gate search+shuffle+play ("If you do") — prior model
 *    ran shuffle/play as siblings of the optional (always fired).
 * 2. Search filter was name residue "Attack Action Card With 2 Or Less {p}" —
 *    fixed to types Action + subtypes Attack + power lte 2 + outputBinding it.
 * 3. Hit AAC must not draw the tutor target off the deck first (Snatch draws on
 *    hit) — use a blank AAC for the hit, snatch-blue (p2) as the tutor target.
 * 4. Blade Break lifecycle is independent of the hit ability.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { maskOfThePouncingLynx } from "../../../../../../cards/src/cards/equipment/mask-of-the-pouncing-lynx.ts";
import { snatchBlue } from "../../../../../../cards/src/cards/actions/snatch.ts";
import { woundingBlowYellow } from "../../../../../../cards/src/cards/actions/wounding-blow.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: {
    /** Per boolean answer in order; last value repeats. */
    optionalAnswers?: readonly boolean[];
    searchCanonicalId?: string;
  } = {},
): void {
  let optionalIndex = 0;
  for (let safety = 0; safety < 72; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      const answers = opts.optionalAnswers ?? [false];
      const value = answers[Math.min(optionalIndex, answers.length - 1)] ?? false;
      optionalIndex += 1;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.searchCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.searchCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("mask-of-the-pouncing-lynx (EVR037)", () => {
  it("proven: bladeBreak d2 — defend contributes 2 then destroy to GY", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [maskOfThePouncingLynx],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(maskOfThePouncingLynx);
    drain(game, { optionalAnswers: [false] });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 2));
    expect(game.as(dash).zone("head")).not.toContain(maskOfThePouncingLynx.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(maskOfThePouncingLynx.canonicalId);
  });

  it("core mechanic: AAC hit → destroy mask → search power≤2 AAC → banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [maskOfThePouncingLynx],
        // Blank AAC for the hit (no on-hit draw that steals the tutor target).
        hand: [woundingBlowYellow],
        // snatchBlue is {p}2 AAC; filler non-attacks + high-power snatch must not match alone.
        deck: [nimblismBlue, snatchBlue, snatchRed, nimblismBlue],
        actionPoints: 1,
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.play(woundingBlowYellow);
    // Accept destroy; pick snatch-blue; decline optional play this turn.
    drain(game, {
      optionalAnswers: [true, false],
      searchCanonicalId: snatchBlue.canonicalId,
    });
    game.helpers.resolveRestOfCombat();
    drain(game, { optionalAnswers: [false] });

    expect(Dash.zone("head")).not.toContain(maskOfThePouncingLynx.canonicalId);
    expect(Dash.zone("graveyard")).toContain(maskOfThePouncingLynx.canonicalId);
    expect(Dash.zone("banished")).toContain(snatchBlue.canonicalId);
    expect(Dash.zone("deck")).not.toContain(snatchBlue.canonicalId);
    // High-power AAC must not be auto-tutored when a legal ≤2{p} pick exists.
    expect(Dash.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("boundaries: decline destroy on hit — mask stays, deck untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [maskOfThePouncingLynx],
        hand: [woundingBlowYellow],
        deck: [snatchBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.play(woundingBlowYellow);
    drain(game, { optionalAnswers: [false] });
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("head")).toContain(maskOfThePouncingLynx.canonicalId);
    expect(Dash.zone("banished")).not.toContain(snatchBlue.canonicalId);
    expect(Dash.zone("deck")).toContain(snatchBlue.canonicalId);
  });

  it("model guard: optional destroy then search AAC power≤2 + shuffle + optional play", () => {
    const a1 = maskOfThePouncingLynx.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.trigger).toMatchObject({
      event: {
        name: "hit",
        actor: "controller",
        filter: { typeBox: { types: ["Action"], subtypes: ["Attack"] } },
      },
    });
    expect(a1.effect).toMatchObject({
      type: "optional",
      effect: { type: "destroy", target: { selector: "self" } },
      then: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
              },
              power: { op: "lte", value: 2 },
            },
            to: { zone: "banished" },
            outputBinding: "it",
          },
          { type: "shuffle", zone: "deck" },
          {
            type: "optional",
            effect: {
              type: "play-card",
              source: { selector: "binding", binding: "it" },
              duration: "this-turn",
            },
          },
        ],
      },
    });
  });
});
