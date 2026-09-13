import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/goldfin-harpoon.generated.ts";

export const goldfinHarpoon = definePitchFamily(fabPitchFamilies["goldfin-harpoon"], {
  abilities: () => ({
    ifWouldBePutIntoGraveyardInsteadRemoveFrom: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "move-zone",
          to: "graveyard",
          subject: "self",
        },
        modification: {
          type: "banish",
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { yellow: goldfinHarpoonYellow } = goldfinHarpoon.cards;
