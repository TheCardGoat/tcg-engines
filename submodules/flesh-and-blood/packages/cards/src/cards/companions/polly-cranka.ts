import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/companions/polly-cranka.generated.ts";
import { crank, perched } from "../shared/keywords.ts";

export const pollyCranka = defineCard(fabCardIdentitiesByCanonicalId.WMTq8GLHDK9ztDckQNDDw, {
  keywords: [crank, perched],
  abilities: {
    returnWithSteam: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "banish",
            from: "arena",
            count: 1,
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "permanent",
            },
          },
          {
            type: "tap",
            target: {
              selector: "self",
            },
          },
          {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        ],
      },
    },
  },
});
