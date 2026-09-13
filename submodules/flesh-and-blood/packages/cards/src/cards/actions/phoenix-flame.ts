import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phoenix-flame.generated.ts";

export const phoenixFlame = definePitchFamily(fabPitchFamilies["phoenix-flame"], {
  keywords: [goAgain],
  abilities: () => ({
    ability2MoreDraconicChainLinksGets1Power: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: phoenixFlameRed } = phoenixFlame.cards;
