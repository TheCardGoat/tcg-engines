import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const volcanicCrescendo: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "W3FveBmY0Z",
  slug: "volcanic-crescendo",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "W3FveBmY0Z:face:default",
      catalogId: "W3FveBmY0Z",
      name: "Volcanic Crescendo",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL", "HARMONY"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Banish any amount of fire element cards from your graveyard. Empower 3+X, where X is the amount of cards banished this way.\n\nHarmonize — If you’ve activated a Melody card this turn, deal X damage to each champion.",
      abilities: [
        {
          id: "W3FveBmY0Z-a1",
          kind: "card-resolution",
          text: "Banish any amount of fire element cards from your graveyard. Empower 3+X, where X is the amount of cards banished this way.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "cards-moved",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                  },
                },
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    3,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "W3FveBmY0Z-a2",
          kind: "card-resolution",
          text: "Harmonize — If you’ve activated a Melody card this turn, deal X damage to each champion.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "cards-moved",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              amount: {
                kind: "modified-ability-result-amount",
                metric: "cards-moved",
              },
            },
          },
        },
      ],
    },
  },
};

export default volcanicCrescendo;
