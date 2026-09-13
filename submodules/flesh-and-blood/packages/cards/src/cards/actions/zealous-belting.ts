import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/zealous-belting.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const zealousBelting = definePitchFamily(fabPitchFamilies["zealous-belting"], {
  abilities: () => ({
    whileStaticGrantProperty: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "pitch-has-card-with-power-greater-than-base",
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
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: zealousBeltingRed,
  yellow: zealousBeltingYellow,
  blue: zealousBeltingBlue,
} = zealousBelting.cards;
