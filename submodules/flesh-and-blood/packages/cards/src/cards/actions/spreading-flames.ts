import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spreading-flames.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const spreadingFlames = definePitchFamily(fabPitchFamilies["spreading-flames"], {
  keywords: [goAgain],
  abilities: () => ({
    draconicAttacksControlHaveNumber1PowerWhileTheirBasePowerLessThan: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "conditional",
        condition: {
          type: "attack-power",
          comparison: {
            op: "lt",
            value: {
              type: "count",
              what: "chain-links",
              player: "controller",
              filter: {
                typeBox: {
                  supertypes: ["Draconic"],
                },
              },
            },
          },
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                supertypes: ["Draconic"],
                subtypes: ["Attack"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  }),
});

export const { red: spreadingFlamesRed } = spreadingFlames.cards;
