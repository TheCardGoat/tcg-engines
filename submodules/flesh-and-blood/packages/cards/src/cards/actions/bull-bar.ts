import { boost, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bull-bar.generated.ts";

export const bullBar = definePitchFamily(fabPitchFamilies["bull-bar"], {
  keywords: [boost],
  abilities: () => ({
    grantProperty: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: {
          name: "Hyper Driver",
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: overpower,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: bullBarRed, yellow: bullBarYellow, blue: bullBarBlue } = bullBar.cards;
