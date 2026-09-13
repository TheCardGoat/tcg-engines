import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/longdraw-half-glove.generated.ts";

/**
 * MST232 Longdraw Half-glove — Ranger Arms d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy this, put 2 cards from your hand and/or arsenal on the
 *   bottom of your deck: Your next arrow attack this turn gets +4{p}.
 *   Battleworn
 *
 * Model notes (hand-authored; case-by-case):
 * - Mixed Instant cost: destroy-self + move-to-deck count 2 from
 *   hand-and-arsenal (bottom). Engine activation costs must accept multi-count
 *   move-to-deck (was count===1 only — Longdraw gap).
 * - Floating +4{p} next Arrow attack (Arrow is FAB subtype).
 */
export const longdrawHalfGlove = defineCard(
  fabCardIdentitiesByCanonicalId["tNBLJKrbDpBL9TMb678wM"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyPut2FromHandArsenalBottomDeck: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "destroy-self",
            },
            {
              class: "effect",
              type: "move-to-deck",
              from: "hand-and-arsenal",
              position: "bottom",
              count: 2,
            },
          ],
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 4,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
          },
        },
      },
    },
  },
);
