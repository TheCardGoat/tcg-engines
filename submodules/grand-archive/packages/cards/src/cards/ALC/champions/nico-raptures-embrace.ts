import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nicoRapturesEmbrace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "29lqrve8fz",
  slug: "nico-raptures-embrace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "29lqrve8fz:face:default",
      catalogId: "29lqrve8fz",
      name: "Nico, Rapture's Embrace",
      lineageName: "Nico",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "Nico can only level up into another \"Nico\" champion.\n\nOn Enter: If there's another water element card in Nico's lineage, look at the top two cards of your deck. Put one of those cards into your graveyard and the other on the bottom of your deck.",
      abilities: [
        {
          id: "29lqrve8fz-a1",
          kind: "static",
          staticKind: "effects",
          text: 'Nico can only level up into another "Nico" champion.',
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "level-up",
              subject: {
                kind: "source",
              },
              destinationFilter: {
                kind: "champion-name",
                value: "Nico",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "29lqrve8fz-a2",
          kind: "triggered",
          text: "On Enter: If there's another water element card in Nico's lineage, look at the top two cards of your deck. Put one of those cards into your graveyard and the other on the bottom of your deck.",
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["inner-lineage"],
                host: {
                  kind: "champion",
                  player: "controller",
                },
                relationship: "lineage-of",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "look-at",
                  player: "controller",
                  selection: {
                    id: "looked-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["main-deck"],
                      relationship: "zone-of",
                      player: "controller",
                      fromTop: true,
                    },
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "graveyard-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      binding: "looked-cards",
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "graveyard-card",
                        },
                        from: "main-deck",
                        destination: {
                          zone: "graveyard",
                        },
                      },
                      {
                        kind: "move",
                        subject: {
                          kind: "binding-remainder",
                          binding: "looked-cards",
                          excluding: "graveyard-card",
                        },
                        from: "main-deck",
                        destination: {
                          zone: "main-deck",
                          placement: {
                            kind: "bottom",
                          },
                        },
                      },
                    ],
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

export default nicoRapturesEmbrace;
