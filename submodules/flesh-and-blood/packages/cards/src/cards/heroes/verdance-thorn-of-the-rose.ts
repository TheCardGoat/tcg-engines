import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/verdance-thorn-of-the-rose.generated.ts";

export const verdanceThornOfTheRose = defineCard(
  fabCardIdentitiesByCanonicalId["wJMCMFqcQfRJmK96kc8qM"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Earth"],
      },
    ],
    abilities: {
      there8MoreEarthBanishedZoneVerdanceGetsWheneverGainLifeDuringTurnDeal1ArcaneDamageAnyOpposingTarget:
        {
          kind: "static",
          staticKind: "triggered",
          // Adult threshold is 8 Earth in banished (Young is 4).
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
                    value: 8,
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
  },
);
