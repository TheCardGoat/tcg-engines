import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lumenBorealis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3ejd9yj9rl",
  slug: "lumen-borealis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3ejd9yj9rl:face:default",
      catalogId: "3ejd9yj9rl",
      name: "Lumen Borealis",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "On Enter: You may reveal a card from your memory.\n\n[Class Bonus] Animal allies you control get +1 POWER and +1 LIFE. \n\nWhenever an Animal ally you control dies, you may reveal a card from your memory.",
      abilities: [
        {
          id: "3ejd9yj9rl-a1",
          kind: "triggered",
          text: "On Enter: You may reveal a card from your memory.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "reveal-selection",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
            },
          },
        },
        {
          id: "3ejd9yj9rl-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Animal allies you control get +1 POWER and +1 LIFE.",
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
                        oneOf: ["ANIMAL"],
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
                        oneOf: ["ANIMAL"],
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
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "3ejd9yj9rl-a3",
          kind: "triggered",
          text: "Whenever an Animal ally you control dies, you may reveal a card from your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["ANIMAL"],
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "reveal-selection",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default lumenBorealis;
