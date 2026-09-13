import { gd01Side7124 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import {
  realResourceCards,
  st01AsticassiaSchoolOfTechnologyEarthHouse016,
  st01WhiteBase015,
} from "./real-cards.ts";

/**
 * Three production Bases with varied printed costs make the empty-base-section
 * deployment state useful for repeated QA passes.
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
      hand: [gd01Side7124, st01AsticassiaSchoolOfTechnologyEarthHouse016, st01WhiteBase015],
      resourceArea: realResourceCards(3),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
