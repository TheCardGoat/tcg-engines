import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodied-helm.generated.ts";

export const bloodiedHelm = defineCard(fabCardIdentitiesByCanonicalId["HjWHLmGhtLQTKjzGRRrdF"], {
  abilities: {
    mayEquip: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "optional",
        effect: {
          type: "equip",
          target: {
            selector: "self",
          },
        },
      },
    },
    instantDestroyPutFromArsenalBottomDeckIfDo: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "if-you-do",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
        then: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
});
