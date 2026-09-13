import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/flick-knives.generated.ts";

export const flickKnives = defineCard(fabCardIdentitiesByCanonicalId["Bh6NHMCNrhdwbHb7CJRb7"], {
  keywords: [bladeBreak],
  abilities: {
    oncePerTurnAttackReaction0TargetDaggerControl: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack-reaction",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "generic",
            amount: 1,
            target: {
              selector: "any-hero",
            },
            source: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["weapon"],
              filter: {
                hasStatus: "not-on-active-chain-link",
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "damage-dealt-this-way",
              comparison: { op: "gt", value: 0 },
            },
            then: {
              type: "set-status",
              status: "hit",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
          {
            type: "destroy",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  },
});
