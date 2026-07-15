import { createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Activated-ability fixture — a single friendly Unit ("Scout Drone") with
 * one 【Activate･Main】 effect: rest itself to draw 1. Mirrors the
 * auto-drain scenario in
 * `packages/engine/src/gundam/moves/core/activate-ability.test.ts`
 * ("auto-drains an activated effect with no targets").
 *
 * Deliberately uses a no-target effect so this spec stays focused on the
 * effect-picker / cost / drain path. A follow-up spec can cover the
 * halt-on-target-selection path (activate → pending targetSelection →
 * click target → resolveEffect) once this scaffolding is stable.
 *
 * Deck is kept small-but-nonzero so we can observe the card count tick
 * down in response to the draw directive.
 */
function makeScoutDrone(): UnitCard {
  const restToDraw: CardEffect = {
    type: "activated",
    activation: { timing: ["activate:main"] },
    cost: { restSelf: true },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Activate･Main】 Rest this Unit: Draw 1.",
  };
  return createMockUnit({
    name: "Scout Drone",
    cost: 1,
    level: 1,
    ap: 1,
    hp: 2,
    color: "blue",
    effects: [restToDraw],
  });
}

export function loadActivateAbilityDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [makeScoutDrone()],
      resourceArea: [createMockResource(), createMockResource()],
      // Nonzero deck so the 【Activate･Main】 draw has something to
      // pull. The UI's deck stack renders this count.
      deck: 10,
      resourceDeck: 10,
    },
    p2: {
      // One active (non-rested) opponent unit. Without it Scout Drone
      // is a legal direct-attacker (rule 8-1-3 — opponent has no units
      // in play → direct attack is legal), and `pickMoveForCard`
      // prioritises `enterBattle` over `activateAbility`, so clicking
      // Scout Drone would start the attack flow instead of the ability
      // picker. An active enemy unit blocks the direct-attack path AND
      // doesn't register as a legal unit target (targets must be
      // rested per 8-1-3), so enterBattle drops Scout Drone from its
      // attacker candidates and activateAbility wins by default.
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
