import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fearless-confrontation.generated.ts";

import { dominate } from "../shared/keywords.ts";

export const fearlessConfrontation = definePitchFamily(fabPitchFamilies["fearless-confrontation"], {
  abilities: () => ({
    instantDiscardTargetAttackGets1LosesCanT: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
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
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: { selector: "binding", binding: "it" },
            duration: "this-turn",
          },
          {
            type: "sequence",
            steps: [
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
        ],
      },
    },
  }),
});
export const { blue: fearlessConfrontationBlue } = fearlessConfrontation.cards;
