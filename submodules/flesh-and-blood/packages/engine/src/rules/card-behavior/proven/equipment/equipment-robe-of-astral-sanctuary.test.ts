/**
 * OMN210 Robe of Astral Sanctuary — Generic Chest d0.
 *
 * Printed:
 *   Instant - {t} your hero, destroy this: Prevent the next 1 damage that
 *   would be dealt to you this turn.
 *
 * Reasoning (case-by-case; OMN209 helm twin on Chest):
 * 1. Instant tap-hero + destroy-self arms prevent 1 this-turn.
 * 2. Defend priority activate → robe GY, hero tapped, snatch 4−1.
 * 3. Already-tapped hero illegal.
 *
 * Status: ✅ Instant tap-hero+destroy → prevent 1; tapped illegal; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { robeOfAstralSanctuary } from "../../../../../../cards/src/cards/equipment/robe-of-astral-sanctuary.ts";

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

describe("robe-of-astral-sanctuary (OMN210)", () => {
  it("core mechanic: Instant tap-hero + destroy → prevent 1 on next damage", () => {
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
        chest: [robeOfAstralSanctuary],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const heroId = game.getState().containers.zonesByPlayerId[Defender.id]!.heroZone[0]!;

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(robeOfAstralSanctuary);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("graveyard")).toContain(robeOfAstralSanctuary.canonicalId);
    expect(Defender.zone("chest")).not.toContain(robeOfAstralSanctuary.canonicalId);
    expect(game.objectState(heroId)?.tapped).toBe(true);
    // Snatch 4, prevent 1 → 3 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: already-tapped hero illegal; model Instant tap-hero+destroy prevention", () => {
    const tapped = FabTestEngine.start(
      {
        hero: bravo,
        heroState: { tapped: true },
        chest: [robeOfAstralSanctuary],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => tapped.as(bravo).activate(robeOfAstralSanctuary)).toThrow();

    const a1 = robeOfAstralSanctuary.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "effect", type: "tap-hero" },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(robeOfAstralSanctuary.base.numeric.defense).toBe(0);
  });
});
