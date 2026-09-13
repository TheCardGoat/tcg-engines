/**
 * FNG005 Blade Beckoner Gauntlets (Arms d1) + HNT219 Blade Beckoner Boots
 * (Legs d1) — siblings of the proven HNT216 Blade Beckoner Helm.
 *
 * Printed: "This gets +1{d} while defending a weapon attack. Guardwell"
 *
 * Card model fix: effect.conditional → ability.condition + direct modify-numeric
 * (matching the proven HNT216 pattern).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { bladeBeckonerGauntlets } from "../../../../../../cards/src/cards/equipment/blade-beckoner-gauntlets.ts";
import { bladeBeckonerBoots } from "../../../../../../cards/src/cards/equipment/blade-beckoner-boots.ts";
import { bladeBeckonerPlating } from "../../../../../../cards/src/cards/equipment/blade-beckoner-plating.ts";

const DAWN = 3;
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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering" as const,
            orderedIds: decision.entries.map((e) => e.id),
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

/** Advance from weapon activate to the defend step. */
function advanceToDefend(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.combat()?.step === "defend") break;
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
    const prio = game.getState().priority?.holderPlayerId;
    if (!prio) break;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

describe("blade-beckoner-gauntlets (FNG005)", () => {
  it("core mechanic: defend weapon → +1{d} (d2); AAC stays d1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [bladeBeckonerGauntlets],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.activate(dawnblade);
    advanceToDefend(game);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(bladeBeckonerGauntlets);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Dawnblade 3 − effective d2 = 1 damage.
    expect(Defender.life()).toBe(LIFE - (DAWN - 2));
  });
});

describe("blade-beckoner-plating (CIN004)", () => {
  it("core mechanic: defend weapon → +1{d} (d2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [bladeBeckonerPlating],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.activate(dawnblade);
    advanceToDefend(game);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(bladeBeckonerPlating);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Dawnblade 3 − effective d2 = 1 damage.
    expect(Defender.life()).toBe(LIFE - (DAWN - 2));
  });
});

describe("blade-beckoner-boots (HNT219)", () => {
  it("core mechanic: defend weapon → +1{d} (d2); Guardwell keeps equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        legs: [bladeBeckonerBoots],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.activate(dawnblade);
    advanceToDefend(game);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(bladeBeckonerBoots);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Dawnblade 3 − effective d2 = 1 damage.
    expect(Defender.life()).toBe(LIFE - (DAWN - 2));
    // Guardwell: boots stays equipped (not destroyed).
    expect(Defender.zone("legs")).toContain(bladeBeckonerBoots.canonicalId);
  });

  it("boundaries: AAC defend stays base d1 (no weapon buff)", () => {
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
        legs: [bladeBeckonerBoots],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(bladeBeckonerBoots);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − base d1 = 3 damage (no weapon attack buff).
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });
});
