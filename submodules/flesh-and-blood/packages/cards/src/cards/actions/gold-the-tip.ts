import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gold-the-tip.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const goldTheTip = definePitchFamily(fabPitchFamilies["gold-the-tip"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
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
    ifThereIsYellowArrowFaceUpArsenalCreate: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "arsenal",
        player: "controller",
        filter: {
          color: ["yellow"],
          typeBox: {
            subtypes: ["Arrow"],
          },
          hasStatus: "face-up",
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "create-token",
        token: "gold",
        controller: "controller",
      },
    },
  }),
});
export const { yellow: goldTheTipYellow } = goldTheTip.cards;
