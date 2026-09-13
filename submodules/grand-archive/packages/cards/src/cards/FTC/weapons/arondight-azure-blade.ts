import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arondightAzureBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "29xxoo7dl5",
  slug: "arondight-azure-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "29xxoo7dl5:face:default",
      catalogId: "29xxoo7dl5",
      name: "Arondight, Azure Blade",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: You may banish any amount of cards with floating memory from your graveyard. For each card banished this way, put a refinement counter on Arondight. \n\nArondight gets +2 POWER for each refinement counter on it.",
      abilities: [
        {
          id: "29xxoo7dl5-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish any amount of cards with floating memory from your graveyard. For each card banished this way, put a refinement counter on Arondight.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "any-number",
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "for-each",
                  collection: {
                    binding: "banished-cards",
                  },
                  bindEachAs: "that-card",
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "refinement",
                    },
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
        {
          id: "29xxoo7dl5-a2",
          kind: "static",
          staticKind: "effects",
          text: "Arondight gets +2 POWER for each refinement counter on it.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                  kind: "calculate",
                  operator: "multiply",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "refinement",
                      },
                    },
                    2,
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default arondightAzureBlade;
