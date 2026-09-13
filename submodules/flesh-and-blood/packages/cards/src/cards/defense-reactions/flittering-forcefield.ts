import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/flittering-forcefield.generated.ts";

export const flitteringForcefield = definePitchFamily(fabPitchFamilies["flittering-forcefield"], {
  abilities: () => ({
    instantPlayedDefenseBonus: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "played-this",
          per: "chain-link",
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        then: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});
export const {
  red: flitteringForcefieldRed,
  yellow: flitteringForcefieldYellow,
  blue: flitteringForcefieldBlue,
} = flitteringForcefield.cards;
