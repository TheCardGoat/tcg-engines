import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/march-of-loyalty.generated.ts";

export const marchOfLoyalty = definePitchFamily(fabPitchFamilies["march-of-loyalty"], {
  abilities: () => ({
    createdFealtyTokenTurnGetsGoAgain: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "create-fealty-token",
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

export const { red: marchOfLoyaltyRed } = marchOfLoyalty.cards;
