import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-seeds.generated.ts";

export const crownOfSeeds = defineCard(fabCardIdentitiesByCanonicalId["Lbp8pFhph9wMqMHDw8JWq"], {
  abilities: {
    oncePerTurnInstantPutFaceDownFromArsenal: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "move-to-deck",
            from: "arsenal",
            position: "bottom",
            count: 1,
            filter: {
              hasStatus: "face-down",
            },
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  },
});
