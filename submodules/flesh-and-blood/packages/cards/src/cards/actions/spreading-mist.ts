import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spreading-mist.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const spreadingMist = definePitchFamily(fabPitchFamilies["spreading-mist"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGetsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
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
    nextTimeWouldCreateWithEphemeralTurnInsteadCreateManyPlusNumber1: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          filter: {
            hasKeyword: "ephemeral",
          },
        },
        modification: {
          type: "create-extra",
          amount: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: spreadingMistBlue } = spreadingMist.cards;
