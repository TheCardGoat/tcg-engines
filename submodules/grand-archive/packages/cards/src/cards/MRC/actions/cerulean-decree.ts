import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ceruleanDecree: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ipl6gt7lh9",
  slug: "cerulean-decree",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ipl6gt7lh9:face:default",
      catalogId: "ipl6gt7lh9",
      name: "Cerulean Decree",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 3\n\nChoose one. If Cerulean Decree is imbued, choose two instead—\n• Negate up to one target non-attack card activation unless its controller pays (2).\n• Up to one target unit’s attacks get -3 POWER until end of turn.\n• Draw a card into your memory.",
      abilities: [
        {
          id: "ipl6gt7lh9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "ipl6gt7lh9-a2",
          kind: "card-resolution",
          text: "Choose one. If Cerulean Decree is imbued, choose two instead—\n• Negate up to one target non-attack card activation unless its controller pays (2).\n• Up to one target unit’s attacks get -3 POWER until end of turn.\n• Draw a card into your memory.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "imbued",
                },
                then: 2,
                else: 1,
              },
            },
            modes: [
              {
                id: "mode-1",
                text: "Negate up to one target non-attack card activation unless its controller pays (2).",
                targets: [
                  {
                    id: "target-stack-item",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "stack-item",
                      itemTypes: ["card-activation"],
                      sourceFilter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ATTACK"],
                          },
                          {
                            kind: "not",
                            filter: {
                              kind: "type",
                              oneOf: ["ATTACK"],
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "unless-paid",
                  player: {
                    controllerOf: "target-stack-item",
                  },
                  cost: {
                    kind: "pay-reserve",
                    amount: 2,
                  },
                  otherwise: {
                    kind: "negate",
                    subject: {
                      kind: "bound",
                      binding: "target-stack-item",
                    },
                    bindResultAs: "negated-stack-item",
                  },
                },
              },
              {
                id: "mode-2",
                text: "Up to one target unit’s attacks get -3 POWER until end of turn.",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "subtract",
                    amount: 3,
                  },
                },
              },
              {
                id: "mode-3",
                text: "Draw a card into your memory",
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default ceruleanDecree;
