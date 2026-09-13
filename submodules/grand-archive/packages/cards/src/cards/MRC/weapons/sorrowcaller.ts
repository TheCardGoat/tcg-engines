import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sorrowcaller: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dv3zb9p4lg",
  slug: "sorrowcaller",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dv3zb9p4lg:face:default",
      catalogId: "dv3zb9p4lg",
      name: "Sorrowcaller",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "GUN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Champion Hit: Reveal the hit opponent’s memory. Deal an amount of unpreventable damage to the hit champion equal to the amount of cards with reserve cost 3 or greater revealed this way.",
      abilities: [
        {
          id: "dv3zb9p4lg-a1",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Reveal the hit opponent’s memory. Deal an amount of unpreventable damage to the hit champion equal to the amount of cards with reserve cost 3 or greater revealed this way.",
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
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "event-recipient-controller",
                selection: {
                  id: "revealed-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "event-recipient-controller",
                  },
                },
              },
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "event-recipient",
                },
                amount: {
                  kind: "count",
                  collection: {
                    binding: "revealed-memory",
                    filter: {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "reserve-cost",
                          basis: "base",
                        },
                        operator: "gte",
                        right: 3,
                      },
                    },
                  },
                },
                preventable: false,
              },
            ],
          },
        },
      ],
    },
  },
};

export default sorrowcaller;
