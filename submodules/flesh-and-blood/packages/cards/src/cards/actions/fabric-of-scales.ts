import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fabric-of-scales.generated.ts";

export const fabricOfScales = definePitchFamily(fabPitchFamilies["fabric-of-scales"], {
  abilities: () => ({
    equipSnapdragonScalersIfDonTNegate: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "negate",
          target: {
            selector: "self",
          },
        },
        escape: {
          type: "equip",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["inventory", "hand", "deck"],
            filter: {
              name: "Snapdragon Scalers",
            },
            count: 1,
          },
        },
      },
      label: {
        name: "negate",
      },
    },
  }),
});
export const { blue: fabricOfScalesBlue } = fabricOfScales.cards;
