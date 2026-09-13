import { ambush } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stadium-security.generated.ts";

export const stadiumSecurity = definePitchFamily(fabPitchFamilies["stadium-security"], {
  abilities: () => ({
    gainAmbushWhileArsenaledAfterControllingToughness: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          { type: "has-status", status: "in-your-arsenal" },
          { type: "performed-this-turn", event: "control-toughness", player: "controller" },
        ],
      },
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
export const {
  red: stadiumSecurityRed,
  yellow: stadiumSecurityYellow,
  blue: stadiumSecurityBlue,
} = stadiumSecurity.cards;
