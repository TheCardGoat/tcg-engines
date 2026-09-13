import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/golden-skull.generated.ts";

import { goAgain, wateryGrave } from "../shared/keywords.ts";

export const goldenSkull = definePitchFamily(fabPitchFamilies["golden-skull"], {
  keywords: [goAgain, wateryGrave],
  abilities: () => ({
    countsAsGold: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "name",
          value: "Gold",
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { yellow: goldenSkullYellow } = goldenSkull.cards;
