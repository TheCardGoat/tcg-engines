import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Newly-deployed-unit-cannot-attack fixture — viewer has a non-Link
 * Unit in hand and enough resources to deploy it, plus a rested
 * enemy that would otherwise be a legal attack target. Mirrors the
 * base rule (3-2-6-3 non-exception) enforced by
 * `packages/engine/src/gundam/rules/derived-state.ts::canAttack`: a
 * Unit deployed on the current turn cannot attack this turn unless
 * it's a Link Unit with a satisfied linkCondition (covered by
 * `link-unit-attack-on-deploy.spec.ts`).
 *
 * Sequence the spec drives:
 *   1. Deploy RX-78-2 from hand (no linkCondition).
 *   2. Try to click it as an attacker — `pickMoveForCard` returns
 *      null because `enterBattle.enumerateCandidates` filters out
 *      freshly-deployed non-Link units.
 *
 * Observable: after the deploy, clicking the unit-on-board does
 * NOT open the attack-targeting overlay.
 */
export function loadNewlyDeployedCannotAttackDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "RX-78-2" })],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Dom" }),
          // Rested — would be a legal target if the attacker were
          // eligible. It's the "newly-deployed" gate alone that must
          // block the attack.
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
