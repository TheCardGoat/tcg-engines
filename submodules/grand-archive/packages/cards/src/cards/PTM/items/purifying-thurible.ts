import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const purifyingThurible: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LeyUk5auEP",
  slug: "purifying-thurible",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LeyUk5auEP:face:default",
      catalogId: "LeyUk5auEP",
      name: "Purifying Thurible",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "(X), Banish Purifying Thurible: Target opponent banishes X cards from their graveyard. If X is 3 or greater, draw a card into your memory. ",
      abilities: [
        {
          id: "LeyUk5auEP-a1",
          kind: "activated",
          text: "(X), Banish Purifying Thurible: Target opponent banishes X cards from their graveyard. If X is 3 or greater, draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "graveyard-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-opponent",
                  },
                  count: {
                    kind: "exactly",
                    amount: {
                      kind: "variable",
                      symbol: "X",
                    },
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
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
                    right: 3,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default purifyingThurible;
