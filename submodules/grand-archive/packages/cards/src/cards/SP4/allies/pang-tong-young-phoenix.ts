import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pangTongYoungPhoenix: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0mz09ojy0t",
  slug: "pang-tong-young-phoenix",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0mz09ojy0t:face:default",
      catalogId: "0mz09ojy0t",
      name: "Pang Tong, Young Phoenix",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "Balance — If damage would be dealt to a unit you control while the amount of cards in your hand and memory are equal, prevent all but 3 of that damage.",
      abilities: [
        {
          id: "0mz09ojy0t-a1",
          kind: "static",
          staticKind: "effects",
          text: "Balance — If damage would be dealt to a unit you control while the amount of cards in your hand and memory are equal, prevent all but 3 of that damage.",
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
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["hand"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
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
                    3,
                  ],
                },
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
          label: {
            name: "Balance",
          },
        },
      ],
    },
  },
};

export default pangTongYoungPhoenix;
