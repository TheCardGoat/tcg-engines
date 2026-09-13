import { wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/moray-le-fay.generated.ts";

export const morayLeFay = definePitchFamily(fabPitchFamilies["moray-le-fay"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionTapAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    instantResourceTapPut1PowerCounterTargetAlly: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Ally"],
            },
          },
          count: 1,
        },
      },
    },
  }),
});

export const { yellow: morayLeFayYellow } = morayLeFay.cards;
