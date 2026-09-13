import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vigorous-roar.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const vigorousRoar = definePitchFamily(fabPitchFamilies["vigorous-roar"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGetsNumber3Power: {
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
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    thereWithNumber6MorePowerInPitchZoneCreateVigorToken: {
      kind: "resolution",
      condition: {
        type: "pitch-zone-has",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      effect: {
        type: "create-token",
        token: "vigor",
        controller: "controller",
      },
    },
  }),
});

export const { red: vigorousRoarRed } = vigorousRoar.cards;
