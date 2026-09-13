import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heirloomOfSpectra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0sVdvpQKXq",
  slug: "heirloom-of-spectra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0sVdvpQKXq:face:default",
      catalogId: "0sVdvpQKXq",
      name: "Heirloom of Spectra",
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
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "Banish Heirloom of Spectra: Choose one— \n• Until end of turn, cards in each opponent’s memory are norm element and lose all abilities.\n• Choose a Curse card in a champion’s lineage and banish it.\n\n(3), Banish Heirloom of Spectra: Draw a card into your memory.",
      abilities: [
        {
          id: "0sVdvpQKXq-a1",
          kind: "activated",
          text: "Banish Heirloom of Spectra: Choose one—\n• Until end of turn, cards in each opponent’s memory are norm element and lose all abilities.\n• Choose a Curse card in a champion’s lineage and banish it.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "normalize-memory",
                text: "Until end of turn, cards in each opponent’s memory are norm element and lose all abilities.",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "each",
                        collection: {
                          zones: ["memory"],
                          player: "each-opponent",
                        },
                      },
                      affectedSet: "dynamic",
                      duration: {
                        kind: "this-turn",
                      },
                      layer: {
                        layer: "C",
                        modifies: "element",
                      },
                      change: {
                        kind: "set-elements",
                        elements: ["NORM"],
                      },
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "each",
                        collection: {
                          zones: ["memory"],
                          player: "each-opponent",
                        },
                      },
                      affectedSet: "dynamic",
                      duration: {
                        kind: "this-turn",
                      },
                      layer: {
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "remove-abilities",
                      },
                    },
                  ],
                },
              },
              {
                id: "banish-curse",
                text: "Choose a Curse card in a champion’s lineage and banish it.",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "lineage-curse",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["inner-lineage"],
                      relationship: "lineage-of",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  effect: {
                    kind: "banish-object",
                    subject: {
                      kind: "bound",
                      binding: "lineage-curse",
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "0sVdvpQKXq-a2",
          kind: "activated",
          text: "(3), Banish Heirloom of Spectra: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default heirloomOfSpectra;
