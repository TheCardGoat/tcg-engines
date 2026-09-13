import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vigor-rush.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const vigorRush = definePitchFamily(fabPitchFamilies["vigor-rush"], {
  abilities: () => ({
    resolutionGrantProperty: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-non-attack-action",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: vigorRushRed, yellow: vigorRushYellow, blue: vigorRushBlue } = vigorRush.cards;
