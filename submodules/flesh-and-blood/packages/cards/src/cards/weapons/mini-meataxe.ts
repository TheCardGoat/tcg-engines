import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/mini-meataxe.generated.ts";

export const miniMeataxe = defineCard(fabCardIdentitiesByCanonicalId["jhhhz6KGqJtTdjBhLTF7B"], {
  abilities: {
    oncePerTurnActionResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    attacksDrawThenDiscardRandom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                random: true,
              },
              outputBinding: "it",
            },
          ],
        },
      },
    },
  },
});
