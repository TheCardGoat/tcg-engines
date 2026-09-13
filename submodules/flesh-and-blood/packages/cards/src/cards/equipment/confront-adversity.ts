import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/confront-adversity.generated.ts";

/**
 * HVY199 Confront Adversity — Generic Chest d2 Blade Break.
 *
 * Printed:
 *   This may only defend an attack if the attack's controller has destroyed
 *   a Vigor token this turn.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - mode "require" (not restrict): same inverted-gate fix as Face Adversity
 *   (HVY198). Restrict + subject matching would block when the condition is
 *   met and allow when it is not.
 * - subject hasStatus attack-controller-destroyed-vigor-token-this-turn is
 *   evaluated on the attack object via facts of the attack controller.
 */
export const confrontAdversity = defineCard(
  fabCardIdentitiesByCanonicalId["GtL9zmpkGKMqgBcFfCQgN"],
  {
    keywords: [bladeBreak],
    abilities: {
      mayOnlyDefendAttackIfAttackSControllerHas: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "require",
          action: "defend",
          filter: {
            name: "Confront Adversity",
          },
          duration: "while-in-arena",
          subject: {
            controllerDestroyedTokenThisTurn: "Vigor",
          },
        },
      },
    },
  },
);
