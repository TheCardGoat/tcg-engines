import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frozenDivinity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1PrDQ1EX0F",
  slug: "frozen-divinity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1PrDQ1EX0F:face:default",
      catalogId: "1PrDQ1EX0F",
      name: "Frozen Divinity",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "If a champion with base level 2 you don’t control would level up into a champion card, return that card to its owner’s material deck instead.\n\nAt the beginning of your end phase, if your champion didn't level up this turn, sacrifice Frozen Divinity.\n\nWhenever your champion levels up into a champion with base level 3, sacrifice Frozen Divinity and draw a card into your memory.",
      abilities: [
        {
          id: "1PrDQ1EX0F-a1",
          kind: "static",
          staticKind: "effects",
          text: "If a champion with base level 2 you don’t control would level up into a champion card, return that card to its owner’s material deck instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "champion-leveled-up",
                subject: {
                  kind: "event-object",
                  bindAs: "level-up-card",
                },
                previousObject: {
                  kind: "event-object",
                  controller: "opponent",
                  filter: {
                    kind: "numeric",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "candidate",
                        },
                        property: "level",
                        basis: "base",
                      },
                      operator: "eq",
                      right: 2,
                    },
                  },
                },
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "level-up-card",
                  },
                  destination: {
                    zone: "material-deck",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1PrDQ1EX0F-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, if your champion didn't level up this turn, sacrifice Frozen Divinity.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
              },
            },
            then: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
        },
        {
          id: "1PrDQ1EX0F-a3",
          kind: "triggered",
          text: "Whenever your champion levels up into a champion with base level 3, sacrifice Frozen Divinity and draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "level",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 3,
                      },
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default frozenDivinity;
