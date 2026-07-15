import { createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * 【Attack】 stat-modifier fixture — attacker's own 【Attack】 trigger
 * grants it AP+3 "during this battle". Mirrors the scenario at
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts:
 * "【Attack】 stat-modifier with thisBattle duration boosts damage in
 * damage-step"`.
 *
 * Without the buff, AP 2 vs HP 5 would leave the defender alive. With
 * the buff, effective AP is 5 → defender destroyed. The buff clears at
 * battle-end (rule 8-6-1), so any follow-up attack this turn would go
 * back to base AP — not tested here (a dedicated spec could cover the
 * clear-at-battle-end path once we need it).
 */
function makeBuffAttacker(): UnitCard {
  const apBoost: CardEffect = {
    type: "triggered",
    activation: { timing: ["attack"] },
    directives: [
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 3,
          duration: "thisBattle",
          target: { owner: "self" },
        },
      },
    ],
    sourceText: "【Attack】 This unit gets AP+3 during this battle.",
  };
  return createMockUnit({
    cost: 3,
    level: 3,
    ap: 2,
    hp: 5,
    color: "blue",
    name: "Buff Gundam",
    effects: [apBoost],
  });
}

export function loadAttackTriggerBuffDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [makeBuffAttacker()],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ cost: 3, level: 3, ap: 1, hp: 5, color: "red", name: "Bulwark" }),
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
