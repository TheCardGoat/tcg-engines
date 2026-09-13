import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-many-faces.generated.ts";

export const maskOfManyFaces = defineCard(fabCardIdentitiesByCanonicalId["7qrdPcNmtPt9HN6TQHNJR"], {
  keywords: [bladeBreak],
  abilities: {
    instantDestroyMaskManyFacesNameNextAttackAction: {
      kind: "activated",
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
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "name-card",
            suggestions: ["your-hand"],
          },
          {
            type: "grant-property",
            property: {
              kind: "name",
              value: "chosen",
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
        ],
      },
    },
  },
});
