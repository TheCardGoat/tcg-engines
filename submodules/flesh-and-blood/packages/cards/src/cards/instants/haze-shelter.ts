import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/haze-shelter.generated.ts";

export const hazeShelter = definePitchFamily(fabPitchFamilies["haze-shelter"], {
  parameters: pitchMap({
    red: { pitchedBlueWard: 4 },
    yellow: { pitchedBlueWard: 3 },
    blue: { pitchedBlueWard: 2 },
  }),
  keywords: [{ name: "ward", value: { type: "x" } }],
  abilities: ({ pitchedBlueWard }) => ({
    ward: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "ward",
          value: {
            type: "conditional",
            condition: { type: "pitch-zone-has", filter: { color: ["blue"] } },
            then: pitchedBlueWard,
            else: 1,
          },
        },
      },
      target: { selector: "self" },
      duration: "while-in-arena",
    },
  }),
});

export const {
  red: hazeShelterRed,
  yellow: hazeShelterYellow,
  blue: hazeShelterBlue,
} = hazeShelter.cards;
