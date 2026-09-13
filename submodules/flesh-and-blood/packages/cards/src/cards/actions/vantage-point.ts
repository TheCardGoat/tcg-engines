import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vantage-point.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const vantagePoint = definePitchFamily(fabPitchFamilies["vantage-point"], {
  abilities: () => ({
    resolutionGrantProperty: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
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

export const {
  red: vantagePointRed,
  yellow: vantagePointYellow,
  blue: vantagePointBlue,
} = vantagePoint.cards;
