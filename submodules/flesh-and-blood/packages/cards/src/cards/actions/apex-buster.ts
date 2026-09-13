import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/apex-buster.generated.ts";

export const apexBuster = definePitchFamily(fabPitchFamilies["apex-buster"], {
  abilities: () => ({
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 2 },
          { class: "effect", type: "discard-self" },
        ],
      },
      condition: {
        type: "attack-power",
        comparison: { op: "gte", value: 6 },
      },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "opponent",
          zones: ["combat-chain"],
          filter: { defending: true },
          count: 1,
        },
      },
    },
  }),
});

export const { yellow: apexBusterYellow } = apexBuster.cards;
