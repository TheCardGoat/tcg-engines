import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/panel-beater.generated.ts";
import { boost } from "../shared/keywords.ts";

export const panelBeater = definePitchFamily(fabPitchFamilies["panel-beater"], {
  keywords: [boost],
  abilities: () => ({
    modifyNumericPowerCountThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "cards-defending",
          per: "chain-link",
          filter: {
            typeBox: {
              types: ["Equipment"],
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

export const {
  red: panelBeaterRed,
  yellow: panelBeaterYellow,
  blue: panelBeaterBlue,
} = panelBeater.cards;
