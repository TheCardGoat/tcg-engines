import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/war-cry-of-themis.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const warCryOfThemis = definePitchFamily(fabPitchFamilies["war-cry-of-themis"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAngelAttackTurnGetsNumber4Power: {
      kind: "resolution",
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
              subtypes: ["Angel"],
            },
          },
        },
      },
    },
    instantDiscardBanishXFromSoulTurnXInBanishedZoneFace: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "discard-self",
          },
          {
            class: "effect",
            type: "banish",
            from: "soul",
            count: {
              type: "x",
            },
          },
        ],
      },
      effect: {
        type: "turn-face-down",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["banished"],
          count: {
            type: "x",
          },
        },
      },
    },
  }),
});

export const { yellow: warCryOfThemisYellow } = warCryOfThemis.cards;
