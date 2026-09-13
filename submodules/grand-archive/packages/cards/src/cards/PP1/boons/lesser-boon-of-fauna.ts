import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfFauna: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rAWlj4c4Ws",
  slug: "lesser-boon-of-fauna",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "rAWlj4c4Ws:face:default",
      catalogId: "rAWlj4c4Ws",
      name: "Lesser Boon of Fauna",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\nFor each of up to two Animal and/or Beast allies you control, your champion gets +1 level.",
      abilities: [
        {
          id: "rAWlj4c4Ws-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked (Play this card only if your champion’s class matches this card’s class.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "rAWlj4c4Ws-a2",
          kind: "static",
          staticKind: "effects",
          text: "For each of up to two Animal and/or Beast allies you control, your champion gets +1 level.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "level",
                operation: "add",
                amount: {
                  kind: "calculate",
                  operator: "minimum",
                  operands: [
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ALLY"],
                            },
                            {
                              kind: "any",
                              filters: [
                                {
                                  kind: "subtype",
                                  oneOf: ["ANIMAL"],
                                },
                                {
                                  kind: "subtype",
                                  oneOf: ["BEAST"],
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                    2,
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lesserBoonOfFauna;
