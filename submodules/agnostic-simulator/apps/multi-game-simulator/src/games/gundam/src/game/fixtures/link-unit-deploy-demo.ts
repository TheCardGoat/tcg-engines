import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { realResourceCards, st01AmuroRay010, st01Gundam001, st03Gouf009 } from "./real-cards.ts";

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
 * The opponent seats a rested Gouf so the Link Unit has a legal
 * unit-target per rule 8-1-3 once it tries to attack.
 */
export function loadLinkUnitDeployDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st01Gundam001, st01AmuroRay010],
      // Five resources meets both level-4 requirements and covers the
      // cost-3 deploy plus cost-1 pair.
      resourceArea: realResourceCards(5),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [{ card: st03Gouf009, exhausted: true }],
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Opponent's pass bot so any downstream attack flows can advance.
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
