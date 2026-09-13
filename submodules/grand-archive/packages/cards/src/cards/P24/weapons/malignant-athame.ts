import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const malignantAthame: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0dr40tfllk",
  slug: "malignant-athame",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0dr40tfllk:face:default",
      catalogId: "0dr40tfllk",
      name: "Malignant Athame",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] On Champion Hit: You may have that opponent swap the cards in their hand and memory. Then if there are four or more cards in their memory, deal 2 unpreventable damage to the hit champion.",
      abilities: [
        {
          id: "0dr40tfllk-a1",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: You may have that opponent swap the cards in their hand and memory. Then if there are four or more cards in their memory, deal 2 unpreventable damage to the hit champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "swap-zones",
                  player: "event-recipient-controller",
                  zones: ["hand", "memory"],
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "player-zone-count",
                    players: "event-recipient-controller",
                    quantifier: "all",
                    zone: "memory",
                    operator: "gte",
                    value: 4,
                  },
                  then: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "event-recipient",
                    },
                    amount: 2,
                    preventable: false,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default malignantAthame;
