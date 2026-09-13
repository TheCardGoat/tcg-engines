import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/verdance.generated.ts";

export const verdance = defineCard(fabCardIdentitiesByCanonicalId["d77Rnf7QF6pfMd6MNgGtm"], {
  keywords: [
    {
      name: "essence",
      supertypes: ["Earth"],
    },
  ],
  abilities: {
    there4MoreEarthBanishedZoneVerdanceGetsWheneverGainLifeDuringTurnDeal1ArcaneDamageAnyOpposingTarget:
      {
        kind: "static",
        staticKind: "triggered",
        // Printed "Verdance gets [triggered ability]" while 4+ Earth are banished.
        // Modeled as a static triggered ability with zone-count + turn-player
        // conditions (same clean shape as Florian's thresholded continuous
        // replacement) — not a grant-property nest.
        trigger: {
          kind: "event-and-state",
          event: {
            name: "gain-life",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "and",
            conditions: [
              {
                type: "zone-count",
                zone: "banished",
                player: "controller",
                filter: {
                  typeBox: {
                    supertypes: ["Earth"],
                  },
                },
                comparison: {
                  op: "gte",
                  value: 4,
                },
              },
              {
                type: "turn-player",
                who: "self",
              },
            ],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hero", "permanent"],
                count: 1,
              },
            },
          },
        },
      },
  },
});
