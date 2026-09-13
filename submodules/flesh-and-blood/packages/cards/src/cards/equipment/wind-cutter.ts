import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/wind-cutter.generated.ts";

export const windCutter = defineCard(fabCardIdentitiesByCanonicalId["nP6cCbptBCkzLqKfPrKNb"], {
  keywords: [bladeBreak],
  abilities: {
    attackReactionSearchDeckShurikenItemPutIntoArena: {
      kind: "activated",
      abilityType: "attack-reaction",
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
            type: "tap-self",
          },
        ],
      },
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "combat-chain-hits" },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            // "a Shuriken item" = Shuriken type + Item type (e.g. Silverwind
            // Shuriken), not a card literally named "Shuriken Item" — the prior
            // name filter never matched any catalog card. Multiple types AND.
            filter: {
              typeBox: {
                subtypes: ["Shuriken", "Item"],
              },
            },
            mayFail: true,
            to: {
              zone: "permanent",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  },
});
