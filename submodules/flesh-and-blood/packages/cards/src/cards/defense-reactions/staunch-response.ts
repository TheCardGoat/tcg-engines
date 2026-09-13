import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/staunch-response.generated.ts";

export const staunchResponse = definePitchFamily(fabPitchFamilies["staunch-response"], {
  abilities: () => ({
    reinforceDefense: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: { class: "asset", type: "resources", amount: 4 },
        optional: true,
        then: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 3,
          target: { selector: "self" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: staunchResponseRed,
  yellow: staunchResponseYellow,
  blue: staunchResponseBlue,
} = staunchResponse.cards;
