import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gambler-s-gloves.generated.ts";

/**
 * CRU179 Gambler's Gloves — Generic Arms d0.
 *
 * Printed: If a hero would roll one or more 6 sided dice, instead after the
 * roll you may destroy Gambler's Gloves. If you do, that hero rerolls all
 * 6 sided dice rolled this way.
 *
 * Model notes (hand-authored):
 * - Prior model replaced "clash" with optional destroy + bare roll — wrong
 *   event family (clash ≠ die roll) and never matched.
 * - Continuous replacement on DSL "roll" (live events: roll-request → roll).
 * - Optional destroy-self then re-roll sides 6: engine auto-accepts when the
 *   gloves are still seated (same class as optional destroy create / prevent
 *   costs); decline UI is a later migration.
 * - Any hero's d6 (not only controller) — no player filter on replaces.
 */
export const gamblerSGloves = defineCard(fabCardIdentitiesByCanonicalId["nC7DHjMkPCgnPbjPdCTdj"], {
  abilities: {
    ifHeroWouldRollOneMore6SidedDice: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "roll",
        },
        modification: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "roll",
            sides: 6,
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});
