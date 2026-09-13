import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/quick-succession.generated.ts";
import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const quickSuccession = definePitchFamily(fabPitchFamilies["quick-succession"], {
  parameters: {
    red: { attacks: 3 },
    yellow: { attacks: 2 },
    blue: { attacks: 1 },
  },
  keywords: [goAgain],
  abilities: ({ attacks }) => ({
    grantPropertyThisTurn: {
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
        appliesTo: nextAttackActionLatch({
          or: [
            {
              typeBox: {
                supertypes: ["Runeblade"],
              },
            },
            {
              typeBox: {
                supertypes: ["Lightning"],
              },
            },
          ],
        }),
      },
    },
    conditionalHasKeywordGoAgainModifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "has-keyword",
          keyword: "go-again",
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
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
            count: attacks,
          },
        },
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: attacks,
        },
      },
    },
  }),
});

export const {
  red: quickSuccessionRed,
  yellow: quickSuccessionYellow,
  blue: quickSuccessionBlue,
} = quickSuccession.cards;
