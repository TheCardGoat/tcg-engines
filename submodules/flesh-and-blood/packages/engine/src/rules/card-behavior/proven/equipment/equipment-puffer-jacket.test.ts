/**
 * AMX004 Puffer Jacket — Mechanologist Chest d2 Temper.
 *
 * Printed (i18n):
 *   Non-token Hyper Drivers you control enter the arena with an additional
 *   steam counter.
 *   Temper
 *
 * Model:
 *   static continuous replacement enter-arena
 *   subject { name: Hyper Driver, excludeMetatypes: [Token] }
 *   → add-counter steam 1 on the entering object
 *   duration while-in-arena
 *
 * Reasoning (hand-authored — architectural gap):
 * 1. Enter-arena +add-counter was only supported for subject:"self" (Hyper
 *    Driver's own text). Puffer Jacket replaces *other* non-token Hyper
 *    Drivers you control — eventMatchesPattern already accepts filter
 *    subjects; supportedCanonicalReplacement did not.
 * 2. "You control" → only when the entering permanent's controller is the
 *    jacket controller (wired in replacementApplies).
 * 3. Hyper Driver (Action Item) enters with 3 steam from self-replacement;
 *    Puffer adds +1 → 4 total when jacket is equipped.
 * 4. Token Hyper Drivers must not receive the extra steam.
 * 5. Without jacket, non-token Hyper Driver stays at printed enter steam (3).
 * 6. Temper first defend d2 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { pufferJacket } from "../../../../../../cards/src/cards/equipment/puffer-jacket.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

const SNATCH = 4;
const LIFE = 20;

function steamOn(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const meta = game.objectState(instanceId) as
    | { steamCounters?: number; namedCounters?: Record<string, number> }
    | undefined;
  if (typeof meta?.steamCounters === "number") return meta.steamCounters;
  if (typeof meta?.namedCounters?.steam === "number") return meta.namedCounters.steam;
  const live = game.getState().objects[instanceId];
  if (!live) return 0;
  return live.counters
    .filter((c) => c.kind === "named" && c.name === "steam")
    .reduce((sum, c) => sum + c.count, 0);
}

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    // Auto-answer forced/single-option decisions (replacement order when
    // Hyper Driver self-steam + Puffer +1 steam both apply on enter-arena).
    if (game.answerForcedDecision()) continue;
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

describe("puffer-jacket (AMX004)", () => {
  it("core mechanic: non-token Hyper Driver enters with +1 steam while jacket equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [pufferJacket],
        hand: [hyperDriverRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.play(hyperDriverRed, { pitch: [nimblismBlue] });
    drain(game);

    expect(Bravo.zone("arena")).toContain(hyperDriverRed.canonicalId);
    expect(Bravo.zone("chest")).toContain(pufferJacket.canonicalId);
    const id = Bravo.findCardInZone("arena", hyperDriverRed);
    // Self-replacement 3 + Puffer +1 = 4.
    expect(steamOn(game, id)).toBe(4);
  });

  it("boundaries: without jacket base 3 steam; Temper d2; model filter shape", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hyperDriverRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bare.as(bravo).play(hyperDriverRed, { pitch: [nimblismBlue] });
    drain(bare);
    const bareId = bare.as(bravo).findCardInZone("arena", hyperDriverRed);
    expect(steamOn(bare, bareId)).toBe(3);

    // Temper first defend.
    const temperGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [pufferJacket],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temperGame.as(dash);
    const plateId = Defender.findCardInZone("chest", pufferJacket);
    temperGame.as(bravo).attackWith(snatchRed);
    Defender.defendWith(pufferJacket);
    drain(temperGame);
    temperGame.helpers.resolveRestOfCombat();

    expect(Defender.zone("chest")).toContain(pufferJacket.canonicalId);
    expect(temperGame.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));

    const a1 = pufferJacket.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.effect).toMatchObject({
      type: "replacement",
      replaces: {
        name: "enter-arena",
        subject: {
          name: "Hyper Driver",
          typeBox: {
            excludeMetatypes: ["Token"],
          },
        },
      },
      modification: {
        type: "add-counter",
        counter: { kind: "named", name: "steam" },
        count: 1,
      },
      duration: "while-in-arena",
    });
  });
});
