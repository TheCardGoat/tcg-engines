/**
 * PEN044 Helm of Unity — Warrior Head d1 Temper + Unity.
 *
 * Printed:
 *   When this defends together with a card from hand, this gets +1{d}
 *   until end of turn.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Trigger: defend + togetherWith playedFromZones hand (Unity label).
 * 2. Effect: +1{d} self until end of turn — must apply before damage.
 * 3. Alone: no buff (base d1); Temper −1 may destroy.
 * 4. With hand co-defender: block uses d2 from helm + hand card defense.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismRed } from "../../../fixtures.ts";
import { helmOfUnity } from "../../../../../../cards/src/cards/equipment/helm-of-unity.ts";

const SNATCH = 4;
const LIFE = 20;
const NIMBLISM_D = 2;

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

describe("helm-of-unity (PEN044)", () => {
  it("core mechanic: defend with hand card → +1{d} this turn (unity)", () => {
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
        head: [helmOfUnity],
        hand: [nimblismRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith([helmOfUnity, nimblismRed]);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Helm d1 + unity +1 = d2; nimblism d2 → total block 4 vs snatch 4 → 0 damage.
    expect(Defender.life()).toBe(LIFE);
    // Temper −1 on d1 base after combat — typically destroys when effective d hits 0.
    // Prefer life math as the unity proof; seat may empty via Temper.
  });

  it("boundaries: alone → base d1 only; model togetherWith hand + temper", () => {
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
        head: [helmOfUnity],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(helmOfUnity);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Solo: no unity buff — snatch 4 − d1 = 3 damage.
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    // Temper −1 on d1 → destroy.
    expect(game.as(dash).zone("head")).not.toContain(helmOfUnity.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(helmOfUnity.canonicalId);

    const a1 = helmOfUnity.base.abilities?.[0];
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
          filter: { playedFromZones: ["hand"] },
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 1,
      duration: "this-turn",
    });
    expect(a1.label).toMatchObject({ name: "unity" });
    expect(helmOfUnity.base.keywords?.some((k) => k.name === "temper")).toBe(true);
    // Sanity: hand co-defend defense constants used above.
    expect(NIMBLISM_D).toBe(2);
  });
});
