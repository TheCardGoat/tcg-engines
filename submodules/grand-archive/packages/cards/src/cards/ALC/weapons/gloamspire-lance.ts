import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireLance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8vn1voy5tt",
  slug: "gloamspire-lance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8vn1voy5tt:face:default",
      catalogId: "8vn1voy5tt",
      name: "Gloamspire Lance",
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
        durability: 4,
      },
      rulesText:
        "[Class Bonus] On Hit: Deal X unpreventable damage to the hit object, then recover X, where X is the amount of Curse cards in the attacker's lineage plus 1.",
      abilities: [
        {
          id: "8vn1voy5tt-a1",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Deal X unpreventable damage to the hit object, then recover X, where X is the amount of Curse cards in the attacker's lineage plus 1.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      host: {
                        kind: "event-attacker",
                      },
                      relationship: "lineage-of",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  1,
                ],
              },
            },
          ],
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
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "event-recipient",
                },
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    {
                      kind: "count",
                      collection: {
                        zones: ["inner-lineage"],
                        host: {
                          kind: "event-attacker",
                        },
                        relationship: "lineage-of",
                        filter: {
                          kind: "subtype",
                          oneOf: ["CURSE"],
                        },
                      },
                    },
                    1,
                  ],
                },
                preventable: false,
              },
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    {
                      kind: "count",
                      collection: {
                        zones: ["inner-lineage"],
                        host: {
                          kind: "event-attacker",
                        },
                        relationship: "lineage-of",
                        filter: {
                          kind: "subtype",
                          oneOf: ["CURSE"],
                        },
                      },
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default gloamspireLance;
