import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tear-limb-from-limb.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tearLimbFromLimb = definePitchFamily(fabPitchFamilies["tear-limb-from-limb"], {
  keywords: [goAgain],
  abilities: () => ({
    drawDiscardRandomWithNumber6MorePowerDiscardedWayNextBruteAttack: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            random: true,
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "discarded-this-way",
              filter: {
                numeric: [
                  {
                    property: "power",
                    basis: "current",
                    comparison: { op: "gte", value: 6 },
                  },
                ],
              },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "subject-property",
                property: "power",
                basis: "base",
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Brute"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: tearLimbFromLimbBlue } = tearLimbFromLimb.cards;
