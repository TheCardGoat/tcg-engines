import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/pile-driver.generated.ts";

export const pileDriver = defineCard(fabCardIdentitiesByCanonicalId["WnNfc9fJMFnH9DGwFRC9F"], {
  keywords: [
    {
      name: "specialization",
      hero: "Betsy",
    },
  ],
  abilities: {
    actionResourceResourceResourceResourceTapAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 4,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
      label: {
        name: "wager",
      },
    },
    attacksWagerGoldTokenDefending: {
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
          type: "optional",
          effect: {
            type: "wager",
            stake: "gold",
          },
        },
      },
      label: {
        name: "wager",
      },
    },
  },
});
