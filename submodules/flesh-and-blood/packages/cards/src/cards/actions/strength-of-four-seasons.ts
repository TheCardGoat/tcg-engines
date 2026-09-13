import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strength-of-four-seasons.generated.ts";

export const strengthOfFourSeasons = definePitchFamily(
  fabPitchFamilies["strength-of-four-seasons"],
  {
    abilities: () => ({
      resolutionModifyNumeric: {
        kind: "resolution",
        condition: {
          type: "zone-count",
          zone: "banished",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Earth"],
            },
          },
          comparison: {
            op: "gte",
            value: 4,
          },
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 4,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    }),
  },
);

export const {
  red: strengthOfFourSeasonsRed,
  yellow: strengthOfFourSeasonsYellow,
  blue: strengthOfFourSeasonsBlue,
} = strengthOfFourSeasons.cards;
