import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kano-dracai-of-aether.generated.ts";

export const kanoDracaiOfAether = defineCard(
  fabCardIdentitiesByCanonicalId["kRPqHdCckKBKfRwjbfzNT"],
  {
    abilities: {
      instantResourceResourceResourceLookTopDeckNonAttackActionBanishPlayTurnThoughWereInstant: {
        kind: "activated",
        abilityType: "instant",
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
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
              },
              then: {
                type: "optional",
                effect: {
                  type: "banish",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
                then: {
                  type: "optional",
                  effect: {
                    type: "play-card",
                    fromZones: ["banished"],
                    source: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-turn",
                    asType: "instant",
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
);
