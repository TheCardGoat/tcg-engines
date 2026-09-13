import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const throneSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RP37sLrsxr",
  slug: "throne-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RP37sLrsxr:face:default",
      catalogId: "RP37sLrsxr",
      name: "Throne Sentinel",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NEOS"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "Hindered, Taunt\n\nOn Enter: Token allies you control get +1POWER until end of turn. If you control three or more tokens, wake up Throne Sentinel.\n\n(2), REST: Your champion gains spellshroud until end of turn.",
      abilities: [
        {
          id: "RP37sLrsxr-a1",
          kind: "keyword-group",
          text: "Hindered, Taunt",
          keywords: [
            {
              name: "hindered",
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "RP37sLrsxr-a2",
          kind: "triggered",
          text: "On Enter: Token allies you control get +1POWER until end of turn. If you control three or more tokens, wake up Throne Sentinel.",
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
                          kind: "token",
                          value: true,
                        },
                        {
                          kind: "subtype",
                          oneOf: ["TOKEN"],
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
                  amount: 1,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "token",
                          value: true,
                        },
                      },
                    },
                    operator: "gte",
                    right: 3,
                  },
                },
                then: {
                  kind: "wake",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
        {
          id: "RP37sLrsxr-a3",
          kind: "activated",
          text: "(2), REST: Your champion gains spellshroud until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
      ],
    },
  },
};

export default throneSentinel;
