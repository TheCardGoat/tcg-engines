import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fabric-of-providence.generated.ts";

import { legendary } from "../shared/keywords.ts";

export const fabricOfProvidence = definePitchFamily(fabPitchFamilies["fabric-of-providence"], {
  keywords: [legendary],
  abilities: () => ({
    equipCrownProvidenceIfDonTNegate: {
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
              name: "Crown of Providence",
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
export const { red: fabricOfProvidenceRed } = fabricOfProvidence.cards;
