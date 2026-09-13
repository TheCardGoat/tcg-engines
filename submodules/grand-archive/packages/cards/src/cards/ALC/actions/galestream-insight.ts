import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galestreamInsight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "usa6qyq3ka",
  slug: "galestream-insight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "usa6qyq3ka:face:default",
      catalogId: "usa6qyq3ka",
      name: "Galestream Insight",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\n[Memory 4+] This card costs 1 less to activate. \n\nLook at the top six cards of your deck. You may reveal a Spell card from among them and put it into your memory. Put the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "usa6qyq3ka-a1",
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
          id: "usa6qyq3ka-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Memory 4+] This card costs 1 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "gte",
                  right: 4,
                },
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
          id: "usa6qyq3ka-a3",
          kind: "card-resolution",
          text: "Look at the top six cards of your deck. You may reveal a Spell card from among them and put it into your memory. Put the rest on the bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 6,
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
                  id: "chosen-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "chosen-card",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-card",
                      },
                      destination: {
                        zone: "memory",
                      },
                    },
                  ],
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "ordered-remainder",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  ordered: true,
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    excluding: ["chosen-card"],
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "ordered-remainder",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
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

export default galestreamInsight;
