import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/courageous-steelhand.generated.ts";

export const courageousSteelhand = definePitchFamily(fabPitchFamilies["courageous-steelhand"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    chargedBoost: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: { typeBox: { subtypes: ["Attack"] } },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});
export const {
  red: courageousSteelhandRed,
  yellow: courageousSteelhandYellow,
  blue: courageousSteelhandBlue,
} = courageousSteelhand.cards;
