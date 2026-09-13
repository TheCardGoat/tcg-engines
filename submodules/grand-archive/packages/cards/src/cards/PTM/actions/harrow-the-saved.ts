import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harrowTheSaved: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mLoz5CAeSU",
  slug: "harrow-the-saved",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mLoz5CAeSU:face:default",
      catalogId: "mLoz5CAeSU",
      name: "Harrow the Saved",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Alice Bonus] As long as there's a Curse card in your champion's lineage, this card costs 3 less to activate.\n\nPut all non-champion non-regalia Specter cards from your banishment into your graveyard. Then recover X, where X is the amount of cards put into your graveyard this way.",
      abilities: [
        {
          id: "mLoz5CAeSU-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] As long as there's a Curse card in your champion's lineage, this card costs 3 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 1,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "mLoz5CAeSU-a2",
          kind: "card-resolution",
          text: "Put all non-champion non-regalia Specter cards from your banishment into your graveyard. Then recover X, where X is the amount of cards put into your graveyard this way.",
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
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["SPECTER"],
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "supertype",
                            oneOf: ["REGALIA"],
                          },
                        },
                      ],
                    },
                  },
                },
                from: "banishment",
                destination: {
                  zone: "graveyard",
                },
                bindResultAs: "moved-specters",
              },
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "modified-ability-result-amount",
                  metric: "cards-moved",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default harrowTheSaved;
