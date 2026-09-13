import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const salamandersBreath: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mob9nu6lal",
  slug: "salamanders-breath",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mob9nu6lal:face:default",
      catalogId: "mob9nu6lal",
      name: "Salamander's Breath",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Diana Bonus] On Attack: You may banish up to X fire element cards from your graveyard where X is the amount of Aethercharge cards in the attacker's intent. This attack gets +1POWER for each card banished this way.",
      abilities: [
        {
          id: "mob9nu6lal-a1",
          kind: "triggered",
          text: "[Diana Bonus] On Attack: You may banish up to X fire element cards from your graveyard where X is the amount of Aethercharge cards in the attacker's intent. This attack gets +1POWER for each card banished this way.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
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
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: {
                        kind: "variable",
                        symbol: "X",
                      },
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: {
                      kind: "count",
                      collection: {
                        binding: "banished-cards",
                      },
                    },
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

export default salamandersBreath;
