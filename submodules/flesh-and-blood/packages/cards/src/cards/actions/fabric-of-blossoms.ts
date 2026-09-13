import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fabric-of-blossoms.generated.ts";

export const fabricOfBlossoms = definePitchFamily(fabPitchFamilies["fabric-of-blossoms"], {
  abilities: () => ({
    equipBlossomSpringIfDonTNegate: {
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
              name: "Blossom of Spring",
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
export const { blue: fabricOfBlossomsBlue } = fabricOfBlossoms.cards;
