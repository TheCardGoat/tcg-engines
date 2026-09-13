import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pureCytosynth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "172utOanGk",
  slug: "pure-cytosynth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "172utOanGk:face:default",
      catalogId: "172utOanGk",
      name: "Pure Cytosynth",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "HUMAN"],
      },
      elements: ["EXALTED", "WATER"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nElysian Aura\n\n[Dante Bonus] On Enter: Put the top three cards of your deck into your graveyard. Then empower X, where X is the amount of water element cards in your graveyard.",
      abilities: [
        {
          id: "172utOanGk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "172utOanGk-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura",
          keyword: {
            name: "elysian-aura",
          },
        },
        {
          id: "172utOanGk-a3",
          kind: "triggered",
          text: "[Dante Bonus] On Enter: Put the top three cards of your deck into your graveyard. Then empower X, where X is the amount of water element cards in your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Dante",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: 3,
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default pureCytosynth;
