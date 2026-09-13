import { goAgain, piercing } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-the-imperial-forge.generated.ts";

export const visitTheImperialForge = definePitchFamily(
  fabPitchFamilies["visit-the-imperial-forge"],
  {
    parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
    keywords: [goAgain],
    abilities: ({ value1 }) => ({
      resolutionGrantProperty: {
        kind: "resolution",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: piercing(value1),
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["combat-chain"],
            filter: {
              or: [
                {
                  typeBox: {
                    subtypes: ["Sword"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Dagger"],
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
  },
);

export const {
  red: visitTheImperialForgeRed,
  yellow: visitTheImperialForgeYellow,
  blue: visitTheImperialForgeBlue,
} = visitTheImperialForge.cards;
