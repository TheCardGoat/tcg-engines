import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * <First Strike> keyword fixture — viewer has a FirstStrike attacker
 * with enough AP to one-shot the opponent's lone unit. Mirrors
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts`
 * First-Strike scenarios (rule 13-1-5-2): attacker's damage resolves
 * before the target's counter-damage, so a lethal hit kills the target
 * and the attacker takes no counter.
 *
 * AP 5 attacker vs HP 4 defender → target dies on the first strike,
 * attacker survives untouched (its HP 4 never eats Dom's AP 3 because
 * Dom was destroyed before its damage window).
 */
export function loadFirstStrikeDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [
        createMockUnit({
          cost: 3,
          level: 3,
          ap: 5,
          hp: 4,
          color: "blue",
          name: "Gundam FS",
          keywordEffects: [{ keyword: "FirstStrike" }],
        }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ cost: 2, level: 2, ap: 3, hp: 4, color: "red", name: "Dom" }),
          // Exhausted so it registers as a legal unit-target (rule
          // 8-1-3 — targets must be rested).
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
