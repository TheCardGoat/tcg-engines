import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fabric-of-spring.generated.ts";

import { legendary } from "../shared/keywords.ts";

export const fabricOfSpring = definePitchFamily(fabPitchFamilies["fabric-of-spring"], {
  keywords: [legendary],
  abilities: () => ({
    equipFyendalSSpringTunicIfDonTNegate: {
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
              name: "Fyendal's Spring Tunic",
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
export const { yellow: fabricOfSpringYellow } = fabricOfSpring.cards;
