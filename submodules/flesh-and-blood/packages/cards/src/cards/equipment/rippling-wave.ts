import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { bladeBreak, cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/rippling-wave.generated.ts";

export const ripplingWave = defineCard(fabCardIdentitiesByCanonicalId["rW8N7tr9TF98TM8fwMfJd"], {
  keywords: [cloaked, bladeBreak],
  abilities: {
    instantTurnFaceUpMayReturnDefendingBlueAttack: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "chi",
            amount: 3,
          },
          {
            class: "effect",
            type: "turn-face-up",
            target: {
              selector: "self",
            },
          },
        ],
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["combat-chain"],
            filter: attackActionFilter({ color: ["blue"], defending: true }),
            count: 1,
          },
          to: {
            zone: "hand",
          },
        },
      },
    },
  },
});
