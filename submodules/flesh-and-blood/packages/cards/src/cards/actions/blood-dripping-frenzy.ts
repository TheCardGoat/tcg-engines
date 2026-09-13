import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blood-dripping-frenzy.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bloodDrippingFrenzy = definePitchFamily(fabPitchFamilies["blood-dripping-frenzy"], {
  keywords: [goAgain],
  abilities: () => ({
    asAdditionalCostPlayBanishHand: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: {
            type: "all",
          },
        },
      },
    },
    drawEachBloodDebtBanishedWay: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: {
          type: "count",
          what: "banished-this-way",
          filter: {
            hasKeyword: "blood-debt",
          },
        },
        player: "controller",
      },
    },
    bruteShadowAttacksGetXTurnWhereXIs: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "banished-this-way",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            and: [
              {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Shadow"],
                },
              },
            ],
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { blue: bloodDrippingFrenzyBlue } = bloodDrippingFrenzy.cards;
