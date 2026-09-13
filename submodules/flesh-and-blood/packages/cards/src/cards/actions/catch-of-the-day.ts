import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/catch-of-the-day.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const catchOfTheDay = definePitchFamily(fabPitchFamilies["catch-of-the-day"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets2: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
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
    ifGoFishEffectWouldTriggerTurnInsteadTriggers: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "trigger",
          filter: {
            hasLabel: "go-fish",
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "multiply",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { blue: catchOfTheDayBlue } = catchOfTheDay.cards;
