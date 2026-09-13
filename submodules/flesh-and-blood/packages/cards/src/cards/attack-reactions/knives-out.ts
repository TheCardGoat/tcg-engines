import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/knives-out.generated.ts";

export const knivesOut = definePitchFamily(fabPitchFamilies["knives-out"], {
  abilities: () => ({
    empowerDaggers: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["weapon", "permanent"],
          filter: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: knivesOutBlue } = knivesOut.cards;
