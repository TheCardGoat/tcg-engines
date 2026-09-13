import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const warMarshal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dlvr8wunhg",
  slug: "war-marshal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dlvr8wunhg:face:default",
      catalogId: "dlvr8wunhg",
      name: "War Marshal",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Steadfast (This ally can retaliate while rested and doesn't rest to do so.)\n\n[Class Bonus] Equestrian — As long as you control a Horse ally, War Marshal gets +1 POWER and +1 LIFE.",
      abilities: [
        {
          id: "dlvr8wunhg-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Steadfast (This ally can retaliate while rested and doesn't rest to do so.)",
          keyword: {
            name: "steadfast",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "dlvr8wunhg-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Equestrian — As long as you control a Horse ally, War Marshal gets +1 POWER and +1 LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
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
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
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
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
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
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
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
                amount: 1,
              },
            },
          ],
          label: {
            name: "Equestrian",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default warMarshal;
