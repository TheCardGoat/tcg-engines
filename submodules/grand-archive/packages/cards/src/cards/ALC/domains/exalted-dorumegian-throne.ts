import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exaltedDorumegianThrone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p4lpnvx7mn",
  slug: "exalted-dorumegian-throne",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p4lpnvx7mn:face:default",
      catalogId: "p4lpnvx7mn",
      name: "Exalted Dorumegian Throne",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "THRONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Allies you control get +1 POWER and +1 LIFE.\n\nUpkeep — At the beginning of your recollection phase, if you control four or fewer other domains, sacrifice Exalted Dorumegian Throne.",
      abilities: [
        {
          id: "p4lpnvx7mn-a1",
          kind: "static",
          staticKind: "effects",
          text: "Allies you control get +1 POWER and +1 LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
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
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
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
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "p4lpnvx7mn-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, if you control four or fewer other domains, sacrifice Exalted Dorumegian Throne.",
          label: {
            name: "Upkeep",
          },
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          interveningCondition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["DOMAIN"],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              operator: "lte",
              right: 4,
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default exaltedDorumegianThrone;
