import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/down-and-dirty.generated.ts";

import { ambush } from "../shared/keywords.ts";

export const downAndDirty = definePitchFamily(fabPitchFamilies["down-and-dirty"], {
  abilities: () => ({
    whileDownDirtyIsArsenalMayDefend: {
      kind: "static",
      staticKind: "while",
      functionalZones: ["arsenal"],
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: ambush,
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { red: downAndDirtyRed } = downAndDirty.cards;
