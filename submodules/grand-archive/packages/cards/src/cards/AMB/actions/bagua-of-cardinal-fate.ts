import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baguaOfCardinalFate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jgyx38zpl0",
  slug: "bagua-of-cardinal-fate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jgyx38zpl0:face:default",
      catalogId: "jgyx38zpl0",
      name: "Bagua of Cardinal Fate",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Depending on your Shifting Currents' direction—\n• North— Put a buff counter on an ally you control.\n• South— Return an ally you control to your owner's hand.\n• West— Glimpse 3. Draw a card.\n• East— Wake up each defending ally. They each get +2 POWER until end of turn.",
      abilities: [
        {
          id: "jgyx38zpl0-a1",
          kind: "card-resolution",
          text: "Depending on your Shifting Currents' direction—\n• North— Put a buff counter on an ally you control.\n• South— Return an ally you control to your owner's hand.\n• West— Glimpse 3. Draw a card.\n• East— Wake up each defending ally. They each get +2 POWER until end of turn.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "north",
                text: "North— Put a buff counter on an ally you control.",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "north",
                  },
                },
                effect: {
                  kind: "choose",
                  selection: {
                    id: "north-ally",
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
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "north-ally",
                    },
                    counter: "buff",
                    amount: 1,
                  },
                },
              },
              {
                id: "south",
                text: "South— Return an ally you control to your owner's hand.",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "south",
                  },
                },
                effect: {
                  kind: "choose",
                  selection: {
                    id: "south-ally",
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
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "south-ally",
                    },
                    destination: {
                      zone: "hand",
                    },
                  },
                },
              },
              {
                id: "west",
                text: "West— Glimpse 3. Draw a card.",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "west",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "keyword-action",
                      action: "glimpse",
                      player: "controller",
                      amount: 3,
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                  ],
                },
              },
              {
                id: "east",
                text: "East— Wake up each defending ally. They each get +2 POWER until end of turn.",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "east",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "wake",
                      subject: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ALLY"],
                              },
                              {
                                kind: "object-state",
                                state: "defending",
                              },
                            ],
                          },
                        },
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "each",
                        collection: {
                          zones: ["field"],
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ALLY"],
                              },
                              {
                                kind: "object-state",
                                state: "defending",
                              },
                            ],
                          },
                        },
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
                        operation: "add",
                        amount: 2,
                      },
                    },
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

export default baguaOfCardinalFate;
