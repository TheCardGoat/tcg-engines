import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/piercing-shadow-vise.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const piercingShadowVise = definePitchFamily(fabPitchFamilies["piercing-shadow-vise"], {
  keywords: [bloodDebt],
  abilities: () => ({
    play: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    performedThisTurnDealArcaneDamageModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "deal-arcane-damage",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: piercingShadowViseRed,
  yellow: piercingShadowViseYellow,
  blue: piercingShadowViseBlue,
} = piercingShadowVise.cards;
