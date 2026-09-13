import { battleworn, dominate } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/unflinching-foothold.generated.ts";

export const unflinchingFoothold = defineCard(
  fabCardIdentitiesByCanonicalId["gMJRbhDCMTJD8NW8H6BTf"],
  {
    keywords: [battleworn],
    abilities: {
      instantDestroyTargetAttackLosesCanTGainDominate: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              target: { selector: "this-attack" },
              outputBinding: "it",
            },
            {
              type: "remove-property",
              property: {
                kind: "keyword",
                keyword: dominate,
              },
              target: { selector: "binding", binding: "it" },
              duration: "this-turn",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "gain-keyword",
              filter: {
                hasKeyword: "dominate",
              },
              subject: { selector: "binding", binding: "it" },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
);
