/**
 * PEN046 Gauntlets of Unity — Warrior Arms d1 Temper + Unity.
 *
 * Printed:
 *   When this defends together with a card from hand, this gets +1{d}
 *   until end of turn.
 *   Temper
 *
 * Mirrors proven PEN044 helm-of-unity (same Unity defend-together +1{d}).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismRed } from "../../../fixtures.ts";
import { gauntletsOfUnity } from "../../../../../../cards/src/cards/equipment/gauntlets-of-unity.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let s = 0; s < 48; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
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
    if (d?.kind === "entity-target") {
      const pick = d.candidates[0];
      if (!pick && (d.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("gauntlets-of-unity (PEN046)", () => {
  it("core: defend with hand card → +1{d} unity (d1→d2; blocks 4 vs snatch 4)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [gauntletsOfUnity], hand: [nimblismRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith([gauntletsOfUnity, nimblismRed]);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Arms d1 + unity +1 = d2; nimblism d2 → total block 4 vs snatch 4 → 0 dmg.
    expect(Defender.life()).toBe(LIFE);
  });

  it("boundary: alone → base d1 only; Temper destroys", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [gauntletsOfUnity], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(gauntletsOfUnity);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Solo: no unity buff — snatch 4 − d1 = 3 damage.
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    // Temper −1 on d1 → destroy.
    expect(game.as(dash).zone("arms")).not.toContain(gauntletsOfUnity.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(gauntletsOfUnity.canonicalId);
  });
});
