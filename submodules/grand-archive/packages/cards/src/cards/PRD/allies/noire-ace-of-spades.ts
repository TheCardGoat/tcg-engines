import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const noireAceOfSpades: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wbjc9t8ycp",
  slug: "noire-ace-of-spades",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wbjc9t8ycp:face:default",
      catalogId: "wbjc9t8ycp",
      name: "Noire, Ace of Spades",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SUITED", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "As long as you control another Suited ally, Noire has stealth.\n\nOn Enter: Depending on the total reserve cost of Suited objects you control—\n• 6— Put a buff counter on Noire.\n• 10— Put two buff counters on Noire.\n• 21— Put four buff counters on Noire.",
      abilities: [
        {
          id: "wbjc9t8ycp-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control another Suited ally, Noire has stealth.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
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
                        oneOf: ["SUITED"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "wbjc9t8ycp-a2",
          kind: "triggered",
          text: "On Enter: Depending on the total reserve cost of Suited objects you control—\n• 6— Put a buff counter on Noire.\n• 10— Put two buff counters on Noire.\n• 21— Put four buff counters on Noire.",
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
            kind: "branch-on-value",
            value: {
              kind: "aggregate-property",
              operation: "sum",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SUITED"],
                },
              },
              property: "reserve-cost",
              basis: "current",
              emptyValue: 0,
            },
            branches: [
              {
                minimum: 6,
                maximum: 6,
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                minimum: 10,
                maximum: 10,
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 2,
                },
              },
              {
                minimum: 21,
                maximum: 21,
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 4,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default noireAceOfSpades;
