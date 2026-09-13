import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const liquidation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b6BFtEqtQM",
  slug: "liquidation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b6BFtEqtQM:face:default",
      catalogId: "b6BFtEqtQM",
      name: "Liquidation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deluge 10 — If there are ten or more water element cards in your graveyard, deal 7 damage to target unit.",
      abilities: [
        {
          id: "b6BFtEqtQM-a1",
          kind: "card-resolution",
          text: "Deluge 10 — If there are ten or more water element cards in your graveyard, deal 7 damage to target unit.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
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
                operator: "gte",
                right: 10,
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 7,
            },
          },
          label: {
            name: "Deluge 10",
          },
        },
      ],
    },
  },
};

export default liquidation;
