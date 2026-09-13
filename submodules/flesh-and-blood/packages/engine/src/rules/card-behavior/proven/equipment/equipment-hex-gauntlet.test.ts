/**
 * IAR004 Hex Gauntlet — Shadow Brute Arms (no printed defense) + Blood Debt.
 *
 * Printed:
 *   Instant - Banish this: Turn a card with blood debt in your banished zone
 *   face-down.
 *   Blood Debt
 *
 * Reasoning (hand-authored; case-by-case; arms twin of IAR161 grille):
 * 1. Instant banish-self pays the cost → equipment leaves Arms to banished.
 * 2. On-stack target is a controller blood-debt card in banished (public).
 * 3. Resolution turns that card face-down (private) in banished.
 * 4. CR 8.3.11a: face-down debt does not tick; Hex itself is banished face-up
 *    with Blood Debt → end-phase −1{h} from Hex (not from the flipped card).
 * 5. No legal blood-debt banished target → Instant illegal.
 * 6. Remodel: banish-self (was banish from:arena); drop power:6 residue.
 *
 * Status: ✅ Instant banish → turn debt face-down; Hex BD ticks; illegal empty.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { hexGauntlet } from "../../../../../../cards/src/cards/equipment/hex-gauntlet.ts";
import { hungeringDemigonYellow } from "../../../../../../cards/src/cards/actions/hungering-demigon.ts";

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

describe("hex-gauntlet (IAR004)", () => {
  it("core mechanic: Instant banish → turn blood-debt banished face-down; Hex BD ticks EOT", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        arms: [hexGauntlet],
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arms")).toContain(hexGauntlet.canonicalId);
    expect(Bravo.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);

    const debtId = Bravo.card(hungeringDemigonYellow);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );

    Bravo.activate(hexGauntlet);
    drain(game);

    // Cost: banish this → Arms empty, equipment banished (not GY).
    expect(Bravo.zone("banished")).toContain(hexGauntlet.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(hexGauntlet.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(hexGauntlet.canonicalId);

    // Effect: target blood-debt card remains banished but is now private.
    expect(Bravo.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(true);

    // CR 8.3.11: face-down demigon does not tick; Hex itself is face-up BD → −1.
    endTurnDrain(game, bravo);
    expect(Bravo.life()).toBe(LIFE - 1);
  });

  it("boundaries: no blood-debt banished → illegal; model banish-self + printed six power", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hexGauntlet],
        banished: [snatchRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(hexGauntlet)).toThrow();

    const a1 = hexGauntlet.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "banish-self" });
    expect(a1.effect).toMatchObject({
      type: "turn-face-down",
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["banished"],
        filter: { hasKeyword: "blood-debt" },
        count: 1,
      },
    });
    expect(hexGauntlet.base.numeric.power).toBe(6);
    expect(hexGauntlet.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blood-debt" })]),
    );
  });
});
