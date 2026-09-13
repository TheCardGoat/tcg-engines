/**
 * MST068 Koi Blessed Kimono — Mystic Chest (no defense) Cloaked.
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, at the start of your turn, if you have
 *   exactly 1{h}, you may turn this face-up.
 *   When this is turned face-up, destroy it. Search your deck for an Inner Chi,
 *   reveal it, put it into your hand, then shuffle.
 *
 * Reasoning (case-by-case):
 * 1. Cloaked seats face-down; life-1 start-phase optional flip (snake/tiger family).
 * 2. Accept flip → turn-face-up event → a2 destroys self + tutors Inner Chi + shuffle.
 * 3. a2 was bare `turn-face-up` (any face-up event). Printed "When this is turned
 *    face-up" needs subject:self so other cloaked/arsenal face-ups cannot fire it.
 * 4. Decline keeps face-down; life ≠ 1 no flip.
 * 5. mayFail: no Inner Chi → still destroy, hand unchanged.
 *
 * Status: ✅ life1 flip → destroy+Inner Chi; decline/life≠1; empty search; subject:self.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, blues } from "../../../fixtures.ts";
import { koiBlessedKimono } from "../../../../../../cards/src/cards/equipment/koi-blessed-kimono.ts";
import { innerChiBlue } from "../../../../../../cards/src/cards/resources/inner-chi.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts?: { acceptBoolean?: boolean; pickCanonicalId?: string },
): void {
  const accept = opts?.acceptBoolean ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts?.pickCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.pickCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
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
    if (decision) {
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

function endTurnDrain(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof bravo,
  opts?: { acceptBoolean?: boolean; pickCanonicalId?: string },
): void {
  game.as(hero).endTurn();
  drain(game, opts);
}

describe("koi-blessed-kimono (MST068)", () => {
  it("core mechanic: life 1 flip → destroy self + tutor Inner Chi to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 1,
        // Empty hand so opening draw does not pull Inner Chi before search.
        hand: [],
        chest: [koiBlessedKimono],
        deck: [...blues(6), innerChiBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const kimonoId = game.getState().containers.zonesByPlayerId[Bravo.id]!.chest[0]!;

    expect(game.objectState(kimonoId)?.faceDown).toBe(true);
    expect(Bravo.zone("deck")).toContain(innerChiBlue.canonicalId);

    // Full cycle: Bravo end → Dash turn → Dash end → Bravo start-phase flip.
    endTurnDrain(game, bravo, { acceptBoolean: true });
    expect(Bravo.zone("chest")).toContain(koiBlessedKimono.canonicalId);
    endTurnDrain(game, dash, {
      acceptBoolean: true,
      pickCanonicalId: innerChiBlue.canonicalId,
    });

    expect(Bravo.zone("chest")).not.toContain(koiBlessedKimono.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(koiBlessedKimono.canonicalId);
    expect(Bravo.zone("hand")).toContain(innerChiBlue.canonicalId);
    expect(Bravo.zone("deck")).not.toContain(innerChiBlue.canonicalId);
  });

  it("boundaries: decline; life ≠ 1; no Inner Chi mayFail destroy; subject:self", () => {
    // Decline at life 1 keeps face-down.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        life: 1,
        hand: [],
        chest: [koiBlessedKimono],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const dId = decline.getState().containers.zonesByPlayerId[decline.as(bravo).id]!.chest[0]!;
    endTurnDrain(decline, bravo, { acceptBoolean: false });
    endTurnDrain(decline, dash, { acceptBoolean: false });
    expect(decline.objectState(dId)?.faceDown).toBe(true);
    expect(decline.as(bravo).zone("chest")).toContain(koiBlessedKimono.canonicalId);

    // Life 2: no optional flip.
    const healthy = FabTestEngine.start(
      {
        hero: bravo,
        life: 2,
        hand: [],
        chest: [koiBlessedKimono],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const hId = healthy.getState().containers.zonesByPlayerId[healthy.as(bravo).id]!.chest[0]!;
    endTurnDrain(healthy, bravo, { acceptBoolean: true });
    endTurnDrain(healthy, dash, { acceptBoolean: true });
    expect(healthy.objectState(hId)?.faceDown).toBe(true);
    expect(healthy.as(bravo).zone("chest")).toContain(koiBlessedKimono.canonicalId);

    // Accept flip with no Inner Chi: destroy still; search mayFail invents no tutor.
    // (Start-of-turn draw may fill hand — assert only that Inner Chi is absent.)
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        life: 1,
        hand: [],
        chest: [koiBlessedKimono],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    endTurnDrain(empty, bravo, { acceptBoolean: true });
    endTurnDrain(empty, dash, { acceptBoolean: true });
    expect(empty.as(bravo).zone("graveyard")).toContain(koiBlessedKimono.canonicalId);
    expect(empty.as(bravo).zone("chest")).not.toContain(koiBlessedKimono.canonicalId);
    expect(empty.as(bravo).zone("hand")).not.toContain(innerChiBlue.canonicalId);

    // Model: a2 subject:self on turn-face-up.
    const a2 = koiBlessedKimono.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static") {
      expect(a2.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "turn-face-up",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "object",
          },
        },
      });
      expect(a2.resolution?.effect).toMatchObject({
        type: "sequence",
        steps: expect.arrayContaining([
          expect.objectContaining({ type: "destroy", target: { selector: "self" } }),
          expect.objectContaining({
            type: "search",
            filter: { name: "Inner Chi" },
            mayFail: true,
            to: { zone: "hand" },
          }),
          expect.objectContaining({ type: "shuffle", zone: "deck" }),
        ]),
      });
    }
    expect(koiBlessedKimono.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
    expect(koiBlessedKimono.base.numeric.defense).toBeUndefined();
  });
});
