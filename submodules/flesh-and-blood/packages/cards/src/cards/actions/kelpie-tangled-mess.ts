import { goAgain, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/kelpie-tangled-mess.generated.ts";

export const kelpieTangledMess = definePitchFamily(fabPitchFamilies["kelpie-tangled-mess"], {
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
    actionResourceTapTapTargetAllyGoAgain: {
      kind: "activated",
      abilityType: "action",
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
      layerKeywords: [goAgain],
      effect: {
        type: "tap",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          filter: {
            or: [
              {
                typeBox: {
                  types: ["Hero"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
            ],
          },
          count: 1,
        },
      },
    },
  }),
});

export const { yellow: kelpieTangledMessYellow } = kelpieTangledMess.cards;
