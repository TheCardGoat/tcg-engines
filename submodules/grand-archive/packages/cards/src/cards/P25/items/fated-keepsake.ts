import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatedKeepsake: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vi1uyifw6s",
  slug: "fated-keepsake",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vi1uyifw6s:face:default",
      catalogId: "vi1uyifw6s",
      name: "Fated Keepsake",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card. \n\n[Guo Jia Bonus] If your champion would take 7 or more damage while you control three or more Fatestone and/or Fatebound objects, prevent all but 6 of that damage.",
      abilities: [
        {
          id: "vi1uyifw6s-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "vi1uyifw6s-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Guo Jia Bonus] If your champion would take 7 or more damage while you control three or more Fatestone and/or Fatebound objects, prevent all but 6 of that damage.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                amountComparison: {
                  left: {
                    kind: "event-amount",
                  },
                  operator: "gte",
                  right: 7,
                },
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["FATESTONE"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["FATEBOUND"],
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              operation: {
                kind: "prevent",
                amount: {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [
                    {
                      kind: "event-amount",
                    },
                    6,
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default fatedKeepsake;
