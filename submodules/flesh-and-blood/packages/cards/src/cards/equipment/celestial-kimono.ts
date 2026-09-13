import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/celestial-kimono.generated.ts";

/**
 * DYN213 Celestial Kimono — Illusionist Chest, Ward 1 (no defense).
 *
 * Printed:
 *   Once per turn, when Celestial Kimono or a non-token permanent you control
 *   with ward is destroyed, gain {r}.
 *   Ward 1
 *
 * Model notes (hand-authored, sibling of DTD217 Diadem of Dreamstate):
 * - Destroy trigger: subjectController:controller + hasKeyword ward +
 *   excludeMetatypes Token (non-token permanent you control with ward;
 *   this kimono is included via LKI ward).
 * - OPT limit 1/turn; effect gain 1{r} (not optional).
 */
export const celestialKimono = defineCard(fabCardIdentitiesByCanonicalId["BJtgTRQQmrbDwrGQMmqm6"], {
  keywords: [ward(1)],
  abilities: {
    oncePerTurnWhenCelestialKimonoNonTokenPermanent: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "controller",
              player: "ability-controller",
            },
            filter: {
              hasKeyword: "ward",
              typeBox: {
                excludeMetatypes: ["Token"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
