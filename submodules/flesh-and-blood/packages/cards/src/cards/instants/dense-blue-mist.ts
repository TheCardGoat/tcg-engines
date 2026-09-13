import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/dense-blue-mist.generated.ts";

export const denseBlueMist = definePitchFamily(fabPitchFamilies["dense-blue-mist"], {
  abilities: () => ({
    attacksTargetTurnGet1: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
    ifChiWasPitchedPlayEffectsDonTTrigger: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-chi-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "trigger",
        filter: {
          hasStatus: "attack-hits-you",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: denseBlueMistBlue } = denseBlueMist.cards;
