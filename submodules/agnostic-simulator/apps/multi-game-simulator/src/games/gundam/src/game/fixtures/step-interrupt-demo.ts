import { eb01GquuuuuuxOmegaPsycommu024, st01DemiTrainer008 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

/**
 * Battle-step interrupt fixture using printed card behavior.
 *
 * GQuuuuuuX (Omega Psycommu) attacks the rested Demi Trainer. Its
 * 【Attack】 effect must resolve before the engine can advance out of the
 * Attack Step. The effect deals 2 damage to the 1 HP Blocker, destroying
 * the selected battle target. Rule 8-2-4 then ends the broken battle and
 * returns to the Main Phase without dealing counterdamage to the attacker.
 */
export function loadStepInterruptDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [eb01GquuuuuuxOmegaPsycommu024],
      resourceArea: realResourceCards(4),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [{ card: st01DemiTrainer008, exhausted: true }],
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
  });
}
