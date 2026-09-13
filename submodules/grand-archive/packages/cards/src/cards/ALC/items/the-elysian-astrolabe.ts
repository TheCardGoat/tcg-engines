import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const theElysianAstrolabe: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4nmxqsm4o9",
  slug: "the-elysian-astrolabe",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4nmxqsm4o9:face:default",
      catalogId: "4nmxqsm4o9",
      name: "The Elysian Astrolabe",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.) \n\nMaterialize this card only if it's the last card in your material deck, and only if your starting material deck size was twelve.\n\nREST: Until end of turn, you may pay (0) rather than pay a card's starcalling costs. When you do, glimpse 5.",
      abilities: [
        {
          id: "4nmxqsm4o9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "4nmxqsm4o9-a2",
          kind: "static",
          staticKind: "effects",
          text: "Materialize this card only if it's the last card in your material deck, and only if your starting material deck size was twelve.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "materialize",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "starting-deck-count",
                      zone: "material-deck",
                      operator: "eq",
                      value: 12,
                    },
                    {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "count",
                          collection: {
                            zones: ["material-deck"],
                            player: "controller",
                          },
                        },
                        operator: "eq",
                        right: 1,
                      },
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4nmxqsm4o9-a3",
          kind: "activated",
          text: "REST: Until end of turn, you may pay (0) rather than pay a card's starcalling costs. When you do, glimpse 5.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "rule-modification",
            mode: "replace-cost",
            action: "pay-cost",
            subject: {
              kind: "player",
              player: "controller",
            },
            costComponent: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 0,
            },
            activationResult: {
              afterResolution: {
                kind: "keyword-action",
                action: "glimpse",
                amount: 5,
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default theElysianAstrolabe;
