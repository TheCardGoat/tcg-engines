import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sacredEngulfment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QvQhg1EOBR",
  slug: "sacred-engulfment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QvQhg1EOBR:face:default",
      catalogId: "QvQhg1EOBR",
      name: "Sacred Engulfment",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nBanish any amount of fire element cards from your graveyard. Then empower 4+X, where X is the amount of fire element cards banished this way.",
      abilities: [
        {
          id: "QvQhg1EOBR-a1",
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
          id: "QvQhg1EOBR-a2",
          kind: "card-resolution",
          text: "Banish any amount of fire element cards from your graveyard. Then empower 4+X, where X is the amount of fire element cards banished this way.",
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
                    4,
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
      ],
    },
  },
};

export default sacredEngulfment;
