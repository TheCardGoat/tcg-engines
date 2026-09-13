/**
 * DYN045 Blazen Yoroi — Ninja Chest d1 Blade Break.
 *
 * Printed:
 *   While Blazen Yoroi is defending on chain link 4 or higher, it has +4{d}.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. has-status defending-on-chain-link-4-or-higher was unwired (always false).
 * 2. Wire: subject/source is among combat.defending AND chainLinkNumber >= 4.
 * 3. Continuous +4{d} on self while condition holds (combat-chain functional).
 * 4. Core: open combat, set live chainLinkNumber to 4 (multi-link OPEN — cannot
 *    reach link 4 via successive go-again yet), defend → blocks d5 (1+4).
 * 5. Link 1 defend → d1 only. Blade Break destroys after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { blazenYoroi } from "../../../../../../cards/src/cards/equipment/blazen-yoroi.ts";

const SNATCH = 4;
const LIFE = 20;
const BASE_D = 1;
const BUFF_D = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
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

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): number | undefined {
  const instanceId =
    game
      .getState()
      .containers.zonesByPlayerId[playerId]!.chest.find(
        (id) => game.getState().objects[id]?.canonicalId === card.canonicalId,
      ) ??
    game
      .getState()
      .containers.zonesByPlayerId[playerId]!.combatChain.find(
        (id) => game.getState().objects[id]?.canonicalId === card.canonicalId,
      );
  if (!instanceId) return undefined;
  const record = game.getState().objects[instanceId]!;
  return buildFabRulesView(game.getState()).object({
    instanceId,
    incarnation: record.incarnation,
  })?.current.numeric.defense;
}

describe("blazen-yoroi (DYN045)", () => {
  it("core mechanic: defending on chain link 4+ → +4{d} (blocks 5)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [blazenYoroi],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // Live combat fact for the continuous gate. Full multi-link go-again
    // accumulation is OPEN (TCC079 family); prove the buff path when link ≥ 4.
    const combat = game.getState().combat;
    expect(combat).toBeTruthy();
    if (combat) combat.chainLinkNumber = 4;

    Bravo.defendWith(blazenYoroi);
    // Check continuous defense while still on the chain (before BB close).
    expect(chestDefense(game, Bravo.id, blazenYoroi)).toBe(BASE_D + BUFF_D);

    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − 5 = 0 damage.
    expect(Bravo.life()).toBe(LIFE);
    // Blade Break: destroyed after defend.
    expect(Bravo.zone("chest")).not.toContain(blazenYoroi.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(blazenYoroi.canonicalId);
  });

  it("boundaries: chain link 1 → d1 only; model condition +4{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [blazenYoroi],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    expect(game.combat()?.chainLinkNumber ?? 1).toBe(1);
    Bravo.defendWith(blazenYoroi);
    expect(chestDefense(game, Bravo.id, blazenYoroi)).toBe(BASE_D);
    drain(game);
    game.helpers.resolveRestOfCombat();
    // Snatch 4 − 1 = 3.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - BASE_D));

    const a1 = blazenYoroi.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.condition).toMatchObject({
      type: "has-status",
      status: "defending-on-chain-link-4-or-higher",
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 4,
      target: { selector: "self" },
    });
  });
});
