import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/seerstone.generated.ts";

export const seerstone = defineCard(fabCardIdentitiesByCanonicalId["FKc7CtkbBDTrzHr7t8DMQ"], {
  abilities: {
    actionResourceResourceResourceLookTopDeckPutBottomCreatePonderToken: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
          {
            type: "create-token",
            token: "ponder",
            controller: "controller",
          },
        ],
      },
    },
  },
});
