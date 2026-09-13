import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const viridescentAetherstreak: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pc0y3xneg7",
  slug: "viridescent-aetherstreak",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pc0y3xneg7:face:default",
      catalogId: "pc0y3xneg7",
      name: "Viridescent Aetherstreak",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nChoose two—\n• Up to one target unit becomes distant.\n• Prevent the next 2 damage that would be dealt to each distant unit this turn.\n• Load Viridescent Aetherstreak into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "pc0y3xneg7-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "pc0y3xneg7-a2",
          kind: "card-resolution",
          text: "Choose two—\n• Up to one target unit becomes distant.\n• Prevent the next 2 damage that would be dealt to each distant unit this turn.\n• Load Viridescent Aetherstreak into an Aetherwing weapon you control.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 2,
            },
            modes: [
              {
                id: "become-distant",
                text: "Up to one target unit becomes distant.",
                targets: [
                  {
                    id: "distant-unit",
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
                  kind: "set-object-state",
                  subject: {
                    kind: "bound",
                    binding: "distant-unit",
                  },
                  state: "distant",
                  value: true,
                },
              },
              {
                id: "prevent-damage",
                text: "Prevent the next 2 damage that would be dealt to each distant unit this turn.",
                effect: {
                  kind: "replacement",
                  event: {
                    name: "damage-dealt",
                    recipient: {
                      kind: "event-object",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  condition: {
                    kind: "object-state",
                    subject: {
                      kind: "event-recipient",
                    },
                    state: "distant",
                  },
                  operation: {
                    kind: "prevent",
                  },
                  capacity: {
                    amount: 2,
                    scope: "per-object",
                  },
                  duration: {
                    kind: "this-turn",
                  },
                },
              },
              {
                id: "load",
                text: "Load Viridescent Aetherstreak into an Aetherwing weapon you control.",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "aetherwing-weapon",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["WEAPON"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["AETHERWING"],
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "source",
                    },
                    destination: {
                      zone: "loaded",
                      host: {
                        kind: "bound",
                        binding: "aetherwing-weapon",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default viridescentAetherstreak;
