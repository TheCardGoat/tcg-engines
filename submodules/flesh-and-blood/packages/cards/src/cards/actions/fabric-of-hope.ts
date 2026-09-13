import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fabric-of-hope.generated.ts";

export const fabricOfHope = definePitchFamily(fabPitchFamilies["fabric-of-hope"], {
  abilities: () => ({
    equipHopeMerchantSHoodIfDonTNegate: {
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
              name: "Hope Merchant's Hood",
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
export const { red: fabricOfHopeRed } = fabricOfHope.cards;
