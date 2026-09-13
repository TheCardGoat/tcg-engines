import { goAgain, phantasm, spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dream-weavers.generated.ts";

/**
 * MON090 Dream Weavers — Illusionist Arms d0 Spellvoid 1.
 *
 * Printed:
 *   Action - Destroy Dream Weavers: The next Illusionist attack action card you
 *   play this turn loses and can't gain phantasm. Go again
 *   Spellvoid 1
 *
 * Model notes (hand-authored; case-by-case):
 * - Floating next-AAC strip: remove-property phantasm + restrict gain-keyword
 *   phantasm, appliesTo next Illusionist Action Attack ordinal 1.
 * - layerKeywords goAgain refunds the Action AP.
 * - Spellvoid 1 is keyword path (keyword suite); seat identity proven here.
 */
export const dreamWeavers = defineCard(fabCardIdentitiesByCanonicalId["CQbkJKNDtz8TkbPcb6hbF"], {
  keywords: [spellvoid(1)],
  abilities: {
    actionDestroyDreamWeaversNextIllusionistAttackActionPlay: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-property",
            property: {
              kind: "keyword",
              keyword: phantasm,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Illusionist"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              ordinal: 1,
            },
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-keyword",
            filter: {
              hasKeyword: "phantasm",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Illusionist"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
              ordinal: 1,
            },
          },
        ],
      },
    },
  },
});
