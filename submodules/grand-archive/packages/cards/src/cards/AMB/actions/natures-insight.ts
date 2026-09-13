import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const naturesInsight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3bS1Y9OQrF",
  slug: "natures-insight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3bS1Y9OQrF:face:default",
      catalogId: "3bS1Y9OQrF",
      name: "Nature's Insight",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nReveal a card from your memory and put it into your material deck preserved. X is that card's reserve cost. Then reveal the top X cards of your deck and put them into your material deck preserved.",
      abilities: [
        {
          id: "3bS1Y9OQrF-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3bS1Y9OQrF-a2",
          kind: "card-resolution",
          text: "Reveal a card from your memory and put it into your material deck preserved. X is that card's reserve cost. Then reveal the top X cards of your deck and put them into your material deck preserved.",
          effect: {
            kind: "choose",
            selection: {
              id: "memory-card",
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
            effect: {
              kind: "bind-value",
              value: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "memory-card",
                },
                property: "reserve-cost",
                basis: "base",
              },
              bindAs: "revealed-reserve-cost",
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "memory-card",
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
                  {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "memory-card",
                        },
                        destination: {
                          zone: "material-deck",
                        },
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "bound",
                          binding: "memory-card",
                        },
                        state: "preserved",
                        value: true,
                      },
                    ],
                  },
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "deck-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: {
                          kind: "binding",
                          binding: "revealed-reserve-cost",
                        },
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "deck-cards",
                        },
                        destination: {
                          zone: "material-deck",
                        },
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "bound",
                          binding: "deck-cards",
                        },
                        state: "preserved",
                        value: true,
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default naturesInsight;
