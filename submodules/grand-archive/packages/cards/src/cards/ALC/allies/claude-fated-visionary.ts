import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const claudeFatedVisionary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "52215upufy",
  slug: "claude-fated-visionary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "52215upufy:face:default",
      catalogId: "52215upufy",
      name: "Claude, Fated Visionary",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        'On Enter: Put the top LV cards of your deck into your graveyard. Then return up to two Automaton ally cards from your graveyard to your memory.\n\nAutomaton allies you control have taunt and "On Death: Glimpse 3."',
      abilities: [
        {
          id: "52215upufy-a1",
          kind: "triggered",
          text: "On Enter: Put the top LV cards of your deck into your graveyard. Then return up to two Automaton ally cards from your graveyard to your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "returned-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
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
                          oneOf: ["AUTOMATON"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "returned-cards",
                  },
                  destination: {
                    zone: "memory",
                  },
                },
              },
            ],
          },
        },
        {
          id: "52215upufy-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Automaton allies you control have taunt and "On Death: Glimpse 3."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        oneOf: ["AUTOMATON"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "taunt",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        oneOf: ["AUTOMATON"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-1pklrms-a1",
                  kind: "triggered",
                  text: "On Death: Glimpse 3.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-died",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                  effect: {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 3,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default claudeFatedVisionary;
