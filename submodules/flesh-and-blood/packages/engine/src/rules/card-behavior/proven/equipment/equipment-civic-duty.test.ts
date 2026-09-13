/**
 * TCC031 Civic Duty — Guardian Chest d2 Temper.
 *
 * Printed:
 *   Whenever this defends, create a Vigor token under another hero's control.
 *   Temper
 *
 * Reasoning (hand-authored, 1v1 product; civic-peak twin):
 * 1. Trigger must be defend subject:self so co-defenders do not fire create.
 * 2. "another hero's control" → create-token controller another-hero. In 1v1
 *    that is the sole opposing seat (no multi-hero chooser).
 * 3. Controller does not get Vigor; attacker/opponent receives the token.
 * 4. Temper d2: first defend leaves seat at d1 (−1 counter).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { civicDuty } from "../../../../../../cards/src/cards/equipment/civic-duty.ts";
import { vigor } from "../../../../../../cards/src/cards/tokens/vigor.ts";

const LIFE = 20;
const SNATCH = 4;
const PLATE_D = 2;

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

function countVigor(
  game: ReturnType<typeof FabTestEngine.start>,
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  return player.zone("arena").filter((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? id;
    return (
      canonical === vigor.canonicalId || canonical === "token:vigor" || /vigor/i.test(canonical)
    );
  }).length;
}

describe("civic-duty (TCC031)", () => {
  it("core mechanic: defend → sole opponent gets Vigor; Temper d2 leaves seat", () => {
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
        chest: [civicDuty],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    expect(countVigor(game, Attacker)).toBe(0);
    expect(countVigor(game, Defender)).toBe(0);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(civicDuty);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Opponent (attacker) controls the Vigor; controller does not.
    expect(countVigor(game, Attacker)).toBe(1);
    expect(countVigor(game, Defender)).toBe(0);
    // snatch 4 − d2 = 2 life loss; Temper keeps plate seated.
    expect(Defender.life()).toBe(LIFE - (SNATCH - PLATE_D));
    expect(Defender.zone("chest")).toContain(civicDuty.canonicalId);
  });

  it("boundaries: co-defender alone does not fire Vigor; subject:self + another-hero model", () => {
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
        chest: [civicDuty],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    // Only hand block — duty stays seated (not defending).
    game.as(dash).defendWith(nimblismBlue);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(countVigor(game, game.as(bravo))).toBe(0);
    expect(countVigor(game, game.as(dash))).toBe(0);
    expect(game.as(dash).zone("chest")).toContain(civicDuty.canonicalId);

    const a1 = civicDuty.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered") return;
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
      type: "create-token",
      token: "vigor",
      controller: "another-hero",
    });
    expect(civicDuty.base.numeric.defense).toBe(2);
    expect(civicDuty.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "temper" })]),
    );
  });
});
