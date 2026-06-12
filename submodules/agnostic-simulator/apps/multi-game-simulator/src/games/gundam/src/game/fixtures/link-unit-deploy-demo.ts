import { createMockPilot, createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * Link-Unit deploy fixture — viewer's hand holds a Unit with a
 * `linkCondition` referencing a specific pilot name, plus a matching
 * pilot. Mirrors
 * `packages/engine/src/gundam/moves/core/link-unit-rules.test.ts:
 * "unit with explicit linkCondition satisfied by pilot CAN attack the
 * deploy turn"` (rule 3-2-6-3).
 *
 * Without the linkCondition satisfied, a unit deployed on the current
 * turn is excluded from `enterBattle` attacker candidates (base rule:
 * freshly deployed units can't attack this turn). Pairing the matching
 * pilot flips the Link Unit flag and unlocks the attack path.
 *
 * The opponent seats a rested Dom so the Link Unit has a legal
 * unit-target per rule 8-1-3 once it tries to attack.
 */
export function loadLinkUnitDeployDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        createMockUnit({
          cost: 1,
          level: 1,
          ap: 2,
          hp: 3,
          color: "blue",
          name: "RX-78-2",
          // `linkCondition` is a bracketed-name matcher. See
          // `satisfiesLinkCondition` in
          // packages/engine/src/gundam/rules/derived-state.ts.
          linkCondition: "[Amuro Ray]",
        } as unknown as Parameters<typeof createMockUnit>[0]),
        createMockPilot({
          name: "Amuro Ray",
          cost: 1,
          level: 1,
          apBonus: 1,
          hpBonus: 1,
        }),
      ],
      // Five resources covers cost-1 deploy + cost-1 pair + headroom,
      // and keeps level requirements (≥1 + ≥1) trivially satisfied.
      resourceArea: Array.from({ length: 5 }, () => createMockResource()),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Dom" }),
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Opponent's pass bot so any downstream attack flows can advance.
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
