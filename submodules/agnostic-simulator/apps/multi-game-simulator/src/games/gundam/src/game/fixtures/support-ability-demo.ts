import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * <Support N> fixture — viewer has two friendly Units on the board:
 * a Supporter with <Support 2> and a Receiver that can take the AP
 * buff. Mirrors the slice of
 * `packages/engine/src/gundam/moves/core/use-support.test.ts`
 * covering rule 13-1-3 (Support activated ability).
 *
 * Support is a keyword-synthesised activated effect — there's no
 * printed `effects` list; `getActivatedEffects` splices the
 * synthesised mode in via
 * `rules/derived-state.ts: synthesiseKeywordActivatedEffects`. UI-side
 * the mode shows up in the `selectMode` picker the same as any
 * printed activated ability.
 *
 * Opponent has an active Zaku II to block the direct-attack path —
 * without it, the Supporter would be a legal direct-attacker and
 * `pickMoveForCard` would start `enterBattle` instead of
 * `activateAbility` (same rationale as `activate-ability-demo`).
 */
export function loadSupportAbilityDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [
        createMockUnit({
          cost: 2,
          level: 2,
          ap: 2,
          hp: 4,
          color: "blue",
          name: "Supporter",
          keywordEffects: [{ keyword: "Support", value: 2 }],
        }),
        createMockUnit({
          cost: 1,
          level: 1,
          ap: 1,
          hp: 3,
          color: "green",
          name: "Receiver",
        }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
