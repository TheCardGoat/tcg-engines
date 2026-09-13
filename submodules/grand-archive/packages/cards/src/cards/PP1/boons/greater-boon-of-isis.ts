import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfIsis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZUXCYJVafM",
  slug: "greater-boon-of-isis",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "ZUXCYJVafM:face:default",
      catalogId: "ZUXCYJVafM",
      name: "Greater Boon of Isis",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked, Level Locked 2\n\nSpell cards you own on the effects stack have “If this source would deal damage, it deals that much damage plus X instead, where X is LV divided by three, rounded down.” ",
      abilities: [
        {
          id: "ZUXCYJVafM-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked, Level Locked 2",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "champion-matches-source",
                    characteristic: "class",
                  },
                  {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                        property: "level",
                        basis: "base",
                      },
                      operator: "gte",
                      right: 2,
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ZUXCYJVafM-a2",
          kind: "static",
          staticKind: "effects",
          text: "Spell cards you own on the effects stack have “If this source would deal damage, it deals that much damage plus X instead, where X is LV divided by three, rounded down.”",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["effects-stack"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-wnqm53-a1",
                  kind: "static",
                  staticKind: "effects",
                  text: "If this source would deal damage, it deals that much damage plus X instead, where X is LV divided by three, rounded down.",
                  variables: [
                    {
                      symbol: "X",
                      kind: "derived",
                      amount: {
                        kind: "calculate",
                        operator: "divide",
                        operands: [
                          {
                            kind: "property",
                            subject: {
                              kind: "champion",
                              player: "controller",
                            },
                            property: "level",
                            basis: "current",
                          },
                          3,
                        ],
                        rounding: "down",
                      },
                    },
                  ],
                  effects: [
                    {
                      kind: "replacement",
                      event: {
                        name: "damage-dealt",
                        subject: {
                          kind: "ability-bearer",
                        },
                      },
                      operation: {
                        kind: "modify-amount",
                        operation: "add",
                        amount: {
                          kind: "calculate",
                          operator: "divide",
                          operands: [
                            {
                              kind: "property",
                              subject: {
                                kind: "champion",
                                player: "controller",
                              },
                              property: "level",
                              basis: "current",
                            },
                            3,
                          ],
                          rounding: "down",
                        },
                      },
                      duration: {
                        kind: "while-source-in-functional-zone",
                      },
                    },
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

export default greaterBoonOfIsis;
