import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/roiling-fissure.generated.ts";

export const roilingFissure = definePitchFamily(fabPitchFamilies["roiling-fissure"], {
  keywords: [goAgain],
  abilities: () => ({
    destroyAuraCostXLessThenDestroySeismicSurgeRepeatProcess: {
      kind: "resolution",
      effect: {
        type: "repeat",
        until: "declined",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                  cost: {
                    op: "lte",
                    value: {
                      type: "x",
                    },
                  },
                },
                count: 1,
              },
            },
            {
              type: "optional",
              effect: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    name: "Seismic Surge",
                  },
                  count: 1,
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: roilingFissureBlue } = roilingFissure.cards;
