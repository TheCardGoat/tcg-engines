import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/night-s-embrace.generated.ts";

export const nightSEmbrace = definePitchFamily(fabPitchFamilies["night-s-embrace"], {
  abilities: () => ({
    empowerStealthAttacks: {
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
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasKeyword: "stealth",
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

export const { blue: nightSEmbraceBlue } = nightSEmbrace.cards;
