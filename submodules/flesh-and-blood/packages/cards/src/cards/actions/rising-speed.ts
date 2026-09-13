import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-speed.generated.ts";

export const risingSpeed = definePitchFamily(fabPitchFamilies["rising-speed"], {
  supertypeSets: [["Brute"], ["Warrior"]],

  abilities: () => ({
    performedThisTurnDrawGrantPropertyThisTurn: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "draw", player: "controller" },
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
export const {
  red: risingSpeedRed,
  yellow: risingSpeedYellow,
  blue: risingSpeedBlue,
} = risingSpeed.cards;
