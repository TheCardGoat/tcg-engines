import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/embrace-adversity.generated.ts";

/**
 * HVY200 Embrace Adversity — Generic Arms d2 Blade Break.
 *
 * Printed:
 *   This may only defend an attack if the attack's controller has destroyed
 *   a Might token this turn.
 *   Blade Break
 *
 * Model notes (hand-authored; arms twin of HVY199 confront-adversity):
 * - mode "require" (not restrict): same inverted-gate fix as Face / Confront
 *   Adversity. Restrict + subject matching would block when the condition is
 *   met and allow when it is not.
 * - subject hasStatus attack-controller-destroyed-might-token-this-turn is
 *   evaluated on the attack object via facts of the attack controller
 *   (playerDestroyedTokenNamesThisTurn).
 */
export const embraceAdversity = defineCard(
  fabCardIdentitiesByCanonicalId["7LBccf7qnHMdgb996CcWz"],
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
            name: "Embrace Adversity",
          },
          duration: "while-in-arena",
          subject: {
            controllerDestroyedTokenThisTurn: "Might",
          },
        },
      },
    },
  },
);
