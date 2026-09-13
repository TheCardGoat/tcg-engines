import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const caoCaoAspirantOfChaos: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d5og6z31q9",
  slug: "cao-cao-aspirant-of-chaos",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d5og6z31q9:face:default",
      catalogId: "d5og6z31q9",
      name: "Cao Cao, Aspirant of Chaos",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Equestrian — As long as you control a Horse ally, this card costs 3 less to activate.\n\n[Class Bonus] On Attack: You may banish a card with floating memory from your graveyard. If you do, deal 2 damage to each rested unit you don't control.",
      abilities: [
        {
          id: "d5og6z31q9-a1",
          kind: "static",
          staticKind: "effects",
          text: "Equestrian — As long as you control a Horse ally, this card costs 3 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
                  },
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          label: {
            name: "Equestrian",
          },
        },
        {
          id: "d5og6z31q9-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish a card with floating memory from your graveyard. If you do, deal 2 damage to each rested unit you don't control.",
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
                      kind: "exactly",
                      amount: 1,
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
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                          {
                            kind: "object-state",
                            state: "rested",
                          },
                        ],
                      },
                    },
                  },
                  amount: 2,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default caoCaoAspirantOfChaos;
