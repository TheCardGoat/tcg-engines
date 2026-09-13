import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/brush-of-heavenly-rites.generated.ts";

export const brushOfHeavenlyRites = defineCard(
  fabCardIdentitiesByCanonicalId["DFPwWqL9PCzLTKJjDzJzJ"],
  {
    abilities: {
      oncePerTurnActionResourceResourceEquipOffHandProclamationNameInventoryGoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "equip",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["inventory"],
            filter: {
              typeBox: {
                types: ["Equipment"],
                subtypes: ["Off-Hand"],
              },
              nameContains: "Proclamation",
            },
            count: 1,
          },
        },
      },
    },
  },
);
