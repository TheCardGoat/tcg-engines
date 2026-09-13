import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const phantasmagoria: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "mastery-representation"
> = {
  canonicalId: "D3rexaXCBo",
  slug: "phantasmagoria",
  definitionKind: "mastery-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "D3rexaXCBo:face:default",
      catalogId: "D3rexaXCBo",
      name: "Phantasmagoria",
      cost: {
        kind: "none",
      },
      typeLine: {
        supertypes: [],
        types: ["MASTERY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: [],
      stats: {},
      rulesText:
        "Non-Specter cards in your graveyard lose all abilities.\n\n[Alice Bonus] Whenever a Specter ally you control dies, put a haunt counter on Phantasmagoria. \n\n[Alice Bonus] At the beginning of your end phase, you may put all cards from your graveyard on the bottom of your deck in any order. If you do, put the top X cards from your deck into your graveyard, where X is the amount of haunt counters on Phantasmagoria.",
      abilities: [
        {
          id: "D3rexaXCBo-a1",
          kind: "static",
          staticKind: "effects",
          text: "Non-Specter cards in your graveyard lose all abilities.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "not",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
                    },
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-abilities",
              },
            },
          ],
        },
        {
          id: "D3rexaXCBo-a2",
          kind: "triggered",
          text: "[Alice Bonus] Whenever a Specter ally you control dies, put a haunt counter on Phantasmagoria.",
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
                      oneOf: ["SPECTER"],
                    },
                  ],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "haunt",
            },
            amount: 1,
          },
        },
        {
          id: "D3rexaXCBo-a3",
          kind: "triggered",
          text: "[Alice Bonus] At the beginning of your end phase, you may put all cards from your graveyard on the bottom of your deck in any order. If you do, put the top X cards from your deck into your graveyard, where X is the amount of haunt counters on Phantasmagoria.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "haunt",
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "choose",
                  selection: {
                    id: "all-graveyard-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "all",
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "all-graveyard-cards",
                    },
                    from: "graveyard",
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                        orderChosenBy: "controller",
                      },
                    },
                  },
                },
                {
                  kind: "mill",
                  player: "controller",
                  amount: {
                    kind: "variable",
                    symbol: "X",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default phantasmagoria;
