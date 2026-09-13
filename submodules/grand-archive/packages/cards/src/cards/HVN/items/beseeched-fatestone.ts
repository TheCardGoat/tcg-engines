import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beseechedFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x7t0vki9gy",
  slug: "beseeched-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "x7t0vki9gy:face:default",
      catalogId: "x7t0vki9gy",
      name: "Beseeched Fatestone",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Materialize a card from your material deck.\n\n[Guo Jia Bonus] (6), REST: Transform Beseeched Fatestone. This ability costs (2) less to activate for each card you've materialized this turn.",
      abilities: [
        {
          id: "x7t0vki9gy-a1",
          kind: "triggered",
          text: "On Enter: Materialize a card from your material deck.",
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
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
        {
          id: "x7t0vki9gy-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (6), REST: Transform Beseeched Fatestone. This ability costs (2) less to activate for each card you've materialized this turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 6,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      history: {
                        event: "card-materialized",
                        window: "this-turn",
                      },
                    },
                  },
                  2,
                ],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "x7t0vki9gy:face:flip",
      catalogId: "1qg2c7mfdj",
      name: "Daunting Panda",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "BEAR"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText: "Vigor (At the beginning of your end phase, wake up this unit.)",
      abilities: [
        {
          id: "1qg2c7mfdj-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor (At the beginning of your end phase, wake up this unit.)",
          keyword: {
            name: "vigor",
          },
        },
      ],
    },
  },
};

export default beseechedFatestone;
