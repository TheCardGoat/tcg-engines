import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flagrantGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Ox449xU5yO",
  slug: "flagrant-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Ox449xU5yO:face:default",
      catalogId: "Ox449xU5yO",
      name: "Flagrant Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: You may level up your champion. If you do, deal 6+X unpreventable damage to it, where X is four times that champion's base level. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
      abilities: [
        {
          id: "Ox449xU5yO-a1",
          kind: "triggered",
          text: "On Enter: You may level up your champion. If you do, deal 6+X unpreventable damage to it, where X is four times that champion's base level. (Your champion levels up into a compatible champion card from your material deck, ignoring materialization costs.)",
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
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "base",
                  },
                  4,
                ],
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "level-up",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  ignoreCosts: true,
                },
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
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      6,
                      {
                        kind: "calculate",
                        operator: "multiply",
                        operands: [
                          {
                            kind: "property",
                            subject: {
                              kind: "champion",
                              player: "controller",
                            },
                            property: "level",
                            basis: "base",
                          },
                          4,
                        ],
                      },
                    ],
                  },
                  preventable: false,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default flagrantGuide;
