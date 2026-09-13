import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luneteFrostbinderPriest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TqCo3xlf93",
  slug: "lunete-frostbinder-priest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TqCo3xlf93:face:default",
      catalogId: "TqCo3xlf93",
      name: "Lunete, Frostbinder Priest",
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
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Allies your opponents control enter the field rested.\n\nBalance — Lunete gets +3 LIFE as long as the amount of cards in your hand and memory are equal.",
      abilities: [
        {
          id: "TqCo3xlf93-a1",
          kind: "static",
          staticKind: "effects",
          text: "Allies your opponents control enter the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TqCo3xlf93-a2",
          kind: "static",
          staticKind: "effects",
          text: "Balance — Lunete gets +3 LIFE as long as the amount of cards in your hand and memory are equal.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                property: "life",
                operation: "add",
                amount: 3,
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

export default luneteFrostbinderPriest;
