import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/off-cuts.generated.ts";

export const offCuts = definePitchFamily(fabPitchFamilies["off-cuts"], {
  keywords: [
    {
      name: "specialization",
      hero: "Frankie",
    },
    goAgain,
  ],
  abilities: () => ({
    destroysEquipment: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "iteration-subject",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { blue: offCutsBlue } = offCuts.cards;
