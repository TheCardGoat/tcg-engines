import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingCindercharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e48axaql3n",
  slug: "blazing-cindercharge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e48axaql3n:face:default",
      catalogId: "e48axaql3n",
      name: "Blazing Cindercharge",
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
      elements: ["FIRE"],
      speed: "slow",
      stats: {
        power: 1,
      },
      rulesText:
        "Deal 3 damage to target champion.\n\n[Class Bonus] If your champion has leveled up this turn, you may load Blazing Cindercharge and up to two fire element Aethercharge cards from your graveyard into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "e48axaql3n-a1",
          kind: "card-resolution",
          text: "Deal 3 damage to target champion.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 3,
          },
        },
        {
          id: "e48axaql3n-a2",
          kind: "card-resolution",
          text: "[Class Bonus] If your champion has leveled up this turn, you may load Blazing Cindercharge and up to two fire element Aethercharge cards from your graveyard into an Aetherwing weapon you control.",
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
            kind: "conditional",
            condition: {
              kind: "history",
              event: "champion-leveled-up",
              window: "this-turn",
              actor: "controller",
              minimum: 1,
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "choose",
                selection: {
                  id: "loaded-aethercharge-cards",
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
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["AETHERCHARGE"],
                        },
                      ],
                    },
                  },
                },
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
                    kind: "after-resolution",
                    stackItem: {
                      kind: "source",
                    },
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "move",
                          subject: {
                            kind: "source",
                          },
                          from: "graveyard",
                          destination: {
                            zone: "loaded",
                            host: {
                              kind: "bound",
                              binding: "aetherwing-weapon",
                            },
                          },
                        },
                        {
                          kind: "move",
                          subject: {
                            kind: "bound",
                            binding: "loaded-aethercharge-cards",
                          },
                          from: "graveyard",
                          destination: {
                            zone: "loaded",
                            host: {
                              kind: "bound",
                              binding: "aetherwing-weapon",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default blazingCindercharge;
