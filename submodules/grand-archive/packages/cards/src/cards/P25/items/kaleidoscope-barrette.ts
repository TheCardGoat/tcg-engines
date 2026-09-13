import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kaleidoscopeBarrette: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qktid6zlyt",
  slug: "kaleidoscope-barrette",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qktid6zlyt:face:default",
      catalogId: "qktid6zlyt",
      name: "Kaleidoscope Barrette",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "ACCESSORY"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\nAt the beginning of your recollection phase, empower X, where X is the amount of phantasias you control. Then if X is 4 or greater, reveal the top card of your deck and put it into your material deck preserved.",
      abilities: [
        {
          id: "qktid6zlyt-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "qktid6zlyt-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, empower X, where X is the amount of phantasias you control. Then if X is 4 or greater, reveal the top card of your deck and put it into your material deck preserved.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "empower",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "variable",
                      symbol: "X",
                    },
                    operator: "gte",
                    right: 4,
                  },
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-top-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
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
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "revealed-top-card",
                      },
                      from: "main-deck",
                      destination: {
                        zone: "material-deck",
                      },
                    },
                    {
                      kind: "set-object-state",
                      subject: {
                        kind: "bound",
                        binding: "revealed-top-card",
                      },
                      state: "preserved",
                      value: true,
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

export default kaleidoscopeBarrette;
