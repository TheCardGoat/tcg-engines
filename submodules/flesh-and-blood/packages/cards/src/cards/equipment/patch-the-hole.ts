import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/patch-the-hole.generated.ts";

export const patchTheHole = defineCard(fabCardIdentitiesByCanonicalId["nJMKbnPpBCWztRhwhngTw"], {
  abilities: {
    instantDestroyReturnFromArsenalHand: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
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
          zone: "hand",
        },
      },
    },
  },
});
