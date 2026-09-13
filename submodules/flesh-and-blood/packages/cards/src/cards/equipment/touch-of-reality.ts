import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/touch-of-reality.generated.ts";

export const touchOfReality = defineCard(fabCardIdentitiesByCanonicalId["nbLtg9mnTztkwRwnf6BL7"], {
  abilities: {
    instantGetsWardXUntilEndTurnDestroyAt: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: {
              type: "x",
            },
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: {
                name: "ward",
                value: {
                  type: "x",
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          {
            type: "destroy",
            target: {
              selector: "self",
            },
            delay: "end-phase",
          },
        ],
      },
    },
  },
});
