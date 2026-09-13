import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/face-adversity.generated.ts";

/**
 * HVY198 Face Adversity — Generic Head d2 Blade Break.
 *
 * Printed: This may only defend an attack if the attack's controller has drawn
 * a card this turn. Blade Break
 *
 * Model notes (hand-authored):
 * - mode "require" (not restrict): defender may only block when the attack
 *   matches subjectFilter. Prior restrict+drawn was inverted (blocked when
 *   drawn, free when not).
 * - subject hasStatus attack-controller-drawn-a-card-this-turn is evaluated
 *   on the attack object via playerCardsDrawn of its controller.
 */
export const faceAdversity = defineCard(fabCardIdentitiesByCanonicalId["WfL7bkMHHG7DNGr6fDRWD"], {
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
          name: "Face Adversity",
        },
        duration: "while-in-arena",
        subject: {
          controllerPerformedThisTurn: "draw",
        },
      },
    },
  },
});
