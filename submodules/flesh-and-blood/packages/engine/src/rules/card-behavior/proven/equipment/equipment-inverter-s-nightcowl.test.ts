/**
 * AAC005 Inverter's Nightcowl — Assassin Chest d1 Battleworn.
 *
 * Printed:
 *   Action - Destroy this: Until end of turn, whenever you play an attack
 *   action card with stealth, gain {r}. Go again
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Action destroy-self + go again AP refund.
 * 2. delayed-trigger duration this-turn multi-fire on play of AAC with stealth
 *    (was one-shot without duration; subtypes Attack never matched type-box).
 * 3. Play stealth AAC → gain {r}; non-stealth play no gain.
 * 4. Battleworn d1 lifecycle.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { inverterSNightcowl } from "../../../../../../cards/src/cards/equipment/inverter-s-nightcowl.ts";
import { infectRed } from "../../../../../../cards/src/cards/actions/infect.ts";

const LIFE = 20;
const SNATCH = 4;

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

describe("inverter-s-nightcowl (AAC005)", () => {
  it("core mechanic: destroy-self → play stealth AAC gains {r}; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [inverterSNightcowl],
        hand: [infectRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(inverterSNightcowl);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(inverterSNightcowl.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(inverterSNightcowl.canonicalId);
    expect(Bravo.actionPoints()).toBe(1); // go again
    expect(Bravo.resourcePoints()).toBe(0);

    // Play stealth AAC — delayed trigger gains 1{r}.
    Bravo.play(infectRed);
    drain(game);

    expect(Bravo.resourcePoints()).toBe(1);
  });

  it("boundaries: non-stealth play no gain; battleworn d1; model duration this-turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [inverterSNightcowl],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(inverterSNightcowl);
    game.passBoth();
    Bravo.play(snatchRed);
    drain(game);

    // Snatch has no stealth — no resource from nightcowl.
    expect(Bravo.resourcePoints()).toBe(0);

    // Battleworn d1: defend contributes 1 defense.
    const bw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [inverterSNightcowl],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(bravo).attackWith(snatchRed);
    bw.as(dash).defendWith(inverterSNightcowl);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    drain(bw);

    expect(bw.as(dash).life()).toBe(LIFE - (SNATCH - 1));

    const a1 = inverterSNightcowl.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.effect).toMatchObject({
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "controller",
              player: "ability-controller",
            },
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
              },
              hasKeyword: "stealth",
            },
          },
        },
      },
      policy: {
        kind: "windowed",
        duration: "this-turn",
        matching: "every",
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-resources", amount: 1 },
      },
    });
    expect(inverterSNightcowl.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
