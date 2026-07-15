import { createMockBase, createMockResource } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Deploy-base fixture — viewer has a cost-0 Base card in hand and an
 * empty base section. Mirrors `deployBase.enumerateCandidates` gating:
 * Base candidates exist only when the base section is empty (rule
 * 4-6-3, "up to one Base face up").
 *
 * We deliberately leave `baseSection` empty here because the setup-phase
 * normally places the EX Base token into it as milestone 6 — a
 * `skipToMainPhase` fixture bypasses that step, so the viewer is free
 * to deploy any Base from hand.
 */
export function loadDeployBaseDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        createMockBase({
          cost: 0,
          level: 1,
          hp: 5,
          color: "blue",
          name: "White Base",
        }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
