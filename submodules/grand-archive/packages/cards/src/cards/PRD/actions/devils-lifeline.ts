import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devilsLifeline: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZfgRLDRGzJ",
  slug: "devils-lifeline",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZfgRLDRGzJ:face:default",
      catalogId: "ZfgRLDRGzJ",
      name: "Devil's Lifeline",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal up to 7 unpreventable damage to your champion. Then scavenge 2+X for an exia element card, where X is the amount of damage dealt to your champion this way. ",
      abilities: [
        {
          id: "ZfgRLDRGzJ-a1",
          kind: "card-resolution",
          text: "Deal up to 7 unpreventable damage to your champion. Then scavenge 2+X for an exia element card, where X is the amount of damage dealt to your champion this way.",
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
              maximum: 7,
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
                preventable: false,
              },
              {
                kind: "keyword-action",
                action: "scavenge",
                player: "controller",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    2,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
                filter: {
                  kind: "element",
                  oneOf: ["EXIA"],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default devilsLifeline;
