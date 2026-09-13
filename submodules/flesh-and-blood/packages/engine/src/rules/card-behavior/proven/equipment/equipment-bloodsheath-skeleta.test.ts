/**
 * CRU141 Bloodsheath Skeleta — Runeblade Chest d2 Temper.
 *
 * Printed:
 *   Instant - Destroy this: The next attack action card and non-attack action
 *   card you play this turn get "This card costs {r} less to play for each
 *   Runechant you control."
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Prior appliesTo and-filter was English residue (Card/And/Non-attack
 *    subtypes) — never matched. Split into two next grants: AAC + non-attack
 *    Action (excludeSubtypes Attack).
 * 2. Runechant count: name "Runechant" (token type-box is Token+Aura).
 * 3. With 2 Runechants, Brutal Assault cost 2 → 0; non-attack cost 1 → 0.
 * 4. Without Runechants, no free cost reduction (AAC still pays full).
 * 5. Temper first defend d2 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { bloodsheathSkeleta } from "../../../../../../cards/src/cards/equipment/bloodsheath-skeleta.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";
import { lineItUpYellow } from "../../../../../../cards/src/cards/actions/line-it-up.ts";
import { runechant } from "../../../../../../cards/src/cards/tokens/runechant.ts";

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
      const pick =
        decision.candidates.find((c) => c.instanceId !== decision.actorId) ??
        decision.candidates[0];
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

describe("bloodsheath-skeleta (CRU141)", () => {
  it("core mechanic: destroy → next AAC and non-attack cost −1 per Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodsheathSkeleta],
        arena: [runechant, runechant],
        // AAC cost 2 (non-attack proven in boundaries).
        hand: [brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(bloodsheathSkeleta);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(bloodsheathSkeleta.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodsheathSkeleta.canonicalId);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(2);

    // AAC cost 2 − 2 Runechants = 0. Runechants also auto-fire on AAC play
    // (deal 1 arcane each, then destroy) → 6 combat + 2 arcane.
    const lifeBefore = Opponent.life();
    const rpBefore = Bravo.resourcePoints();
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Opponent.life()).toBe(lifeBefore - 6 - 2);
    expect(Bravo.resourcePoints()).toBe(rpBefore);
    // Runechants spent themselves on the AAC play.
    expect(Bravo.zone("arena").filter((id) => id === runechant.canonicalId).length).toBe(0);
  });

  it("boundaries: 0 Runechants no free AAC; non-attack gets discount; Temper d2", () => {
    // No Runechants: cost-2 AAC still illegal at 0{r} after destroy.
    const none = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodsheathSkeleta],
        arena: [],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    none.as(bravo).activate(bloodsheathSkeleta);
    drain(none);
    expect(() => none.as(bravo).attackWith(brutalAssaultRed)).toThrow();

    // Non-attack path with 1 Runechant: Line It Up cost 1 → 0.
    const nonAtk = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodsheathSkeleta],
        arena: [runechant],
        hand: [lineItUpYellow],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const N = nonAtk.as(bravo);
    N.activate(bloodsheathSkeleta);
    drain(nonAtk);
    N.play(lineItUpYellow);
    drain(nonAtk);
    expect(N.resourcePoints()).toBe(0);
    expect(N.zone("hand")).not.toContain(lineItUpYellow.canonicalId);

    // Temper.
    const temper = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [bloodsheathSkeleta],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temper.as(dash);
    const plateId = Defender.findCardInZone("chest", bloodsheathSkeleta);
    temper.as(bravo).attackWith(snatchRed);
    Defender.defendWith(bloodsheathSkeleta);
    drain(temper);
    temper.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(bloodsheathSkeleta.canonicalId);
    expect(temper.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));

    const a1 = bloodsheathSkeleta.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.effect).toMatchObject({ type: "sequence" });
    const steps = (a1.effect as { steps: readonly unknown[] }).steps;
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
    });
    expect(steps[1]).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      appliesTo: {
        next: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
      },
    });
  });
});
