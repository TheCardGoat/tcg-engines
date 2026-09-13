import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crackling.generated.ts";

export const crackling = definePitchFamily(fabPitchFamilies["crackling"], {
  abilities: () => ({
    ifVePlayedLightningTurnGets1: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: {
            supertypes: ["Lightning"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
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
      label: {
        name: "lightning-flow",
      },
    },
  }),
});
export const { red: cracklingRed, yellow: cracklingYellow } = crackling.cards;
