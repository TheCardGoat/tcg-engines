/**
 * MST066 Traverse the Universe — Mystic Head d2 Blade Break.
 *
 * Printed:
 *   When this defends, search your deck for an Inner Chi, reveal it, put it
 *   into your hand, then shuffle.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self → search deck name "Inner Chi" → hand + shuffle.
 * 2. Inner Chi blue slug strips color → catalog name "Inner Chi" matches.
 * 3. mayFail: true — no Inner Chi in deck → no hand gain, still BB.
 * 4. Blade Break d2 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { traverseTheUniverse } from "../../../../../../cards/src/cards/equipment/traverse-the-universe.ts";
import { innerChiBlue } from "../../../../../../cards/src/cards/resources/inner-chi.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;

function drain(game: ReturnType<typeof FabTestEngine.start>, pickCanonicalId?: string): void {
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
      const pick =
        (pickCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === pickCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) {
        // mayFail search with empty candidates — answer empty if allowed.
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

describe("traverse-the-universe (MST066)", () => {
  it("core mechanic: defend → search Inner Chi to hand + BB d2", () => {
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
        head: [traverseTheUniverse],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, innerChiBlue],
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    expect(Defender.zone("deck")).toContain(innerChiBlue.canonicalId);
    expect(Defender.zone("hand")).not.toContain(innerChiBlue.canonicalId);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(traverseTheUniverse);
    drain(game, innerChiBlue.canonicalId);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("hand")).toContain(innerChiBlue.canonicalId);
    expect(Defender.zone("deck")).not.toContain(innerChiBlue.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
    expect(Defender.zone("graveyard")).toContain(traverseTheUniverse.canonicalId);
  });

  it("boundaries: no Inner Chi → mayFail empty; subject:self model; BB still", () => {
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
        head: [traverseTheUniverse],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const handBefore = game.as(dash).zone("hand").length;
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(traverseTheUniverse);
    drain(game);
    // After trigger window, hand unchanged (no tutor).
    expect(game.as(dash).zone("hand").length).toBe(handBefore);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - DEF));
    expect(game.as(dash).zone("graveyard")).toContain(traverseTheUniverse.canonicalId);

    const a1 = traverseTheUniverse.base.abilities?.[0];
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
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "search",
          zones: ["deck"],
          filter: { name: "Inner Chi" },
          mayFail: true,
          to: { zone: "hand" },
        },
        { type: "shuffle", zone: "deck" },
      ],
    });
  });
});
