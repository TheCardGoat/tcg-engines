import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rift-bind.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const riftBind = definePitchFamily(fabPitchFamilies["rift-bind"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playModifyNumericPowerCountThisTurn: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-played-this-turn",
          filter: {
            typeBox: {
              types: ["Action"],
              excludeSubtypes: ["Attack"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: riftBindRed, yellow: riftBindYellow, blue: riftBindBlue } = riftBind.cards;
