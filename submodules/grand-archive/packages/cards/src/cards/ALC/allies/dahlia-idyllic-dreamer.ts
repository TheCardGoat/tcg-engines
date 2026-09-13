import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dahliaIdyllicDreamer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7xgwve1d47",
  slug: "dahlia-idyllic-dreamer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7xgwve1d47:face:default",
      catalogId: "7xgwve1d47",
      name: "Dahlia, Idyllic Dreamer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: Look at the top card of your deck. If it's a water element card, you may put it into your graveyard.\n\nDahlia has ranged X, where X is the amount of water element cards in your graveyard.",
      abilities: [
        {
          id: "7xgwve1d47-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Look at the top card of your deck. If it's a water element card, you may put it into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-card",
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
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "looked-card",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "looked-card",
                    },
                    from: "main-deck",
                    destination: {
                      zone: "graveyard",
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "7xgwve1d47-a2",
          kind: "static",
          staticKind: "effects",
          text: "Dahlia has ranged X, where X is the amount of water element cards in your graveyard.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                kind: "grant-keyword",
                keyword: {
                  name: "ranged",
                  value: {
                    kind: "variable",
                    symbol: "X",
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default dahliaIdyllicDreamer;
