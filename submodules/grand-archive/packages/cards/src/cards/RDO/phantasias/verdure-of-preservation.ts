import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const verdureOfPreservation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wCAIuvPOAT",
  slug: "verdure-of-preservation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wCAIuvPOAT:face:default",
      catalogId: "wCAIuvPOAT",
      name: "Verdure of Preservation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Kongming Bonus] Whenever your Shifting Currents change to facing the next clockwise direction, reveal the top card of your deck and put it into your material deck preserved. \n\n(3), Sacrifice Verdure of Preservation: Empower X, where X is twice the amount of preserved cards in your material deck. Activate this ability only if there are five or more preserved cards in your material deck.",
      abilities: [
        {
          id: "wCAIuvPOAT-a1",
          kind: "triggered",
          text: "[Kongming Bonus] Whenever your Shifting Currents change to facing the next clockwise direction, reveal the top card of your deck and put it into your material deck preserved.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                relation: "next-clockwise",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
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
        {
          id: "wCAIuvPOAT-a2",
          kind: "activated",
          text: "(3), Sacrifice Verdure of Preservation: Empower X, where X is twice the amount of preserved cards in your material deck. Activate this ability only if there are five or more preserved cards in your material deck.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["material-deck"],
                  player: "controller",
                  filter: {
                    kind: "object-state",
                    state: "preserved",
                  },
                },
              },
              operator: "gte",
              right: 5,
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["material-deck"],
                      player: "controller",
                      filter: {
                        kind: "object-state",
                        state: "preserved",
                      },
                    },
                  },
                  2,
                ],
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "empower",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "multiply",
              operands: [
                {
                  kind: "count",
                  collection: {
                    zones: ["material-deck"],
                    player: "controller",
                    filter: {
                      kind: "object-state",
                      state: "preserved",
                    },
                  },
                },
                2,
              ],
            },
          },
        },
      ],
    },
  },
};

export default verdureOfPreservation;
