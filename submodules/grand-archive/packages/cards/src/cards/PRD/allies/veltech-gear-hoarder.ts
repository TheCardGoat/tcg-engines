import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veltechGearHoarder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3EiA5HoKv2",
  slug: "veltech-gear-hoarder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3EiA5HoKv2:face:default",
      catalogId: "3EiA5HoKv2",
      name: "VelTech Gear Hoarder",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "VelTech Gear Hoarder gets +1POWER and +1LIFE for each VelTech item linked to it.",
      abilities: [
        {
          id: "3EiA5HoKv2-a1",
          kind: "static",
          staticKind: "effects",
          text: "VelTech Gear Hoarder gets +1POWER and +1LIFE for each VelTech item linked to it.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    host: {
                      kind: "source",
                    },
                    relationship: "linked-to",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["VELTECH"],
                        },
                      ],
                    },
                  },
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    host: {
                      kind: "source",
                    },
                    relationship: "linked-to",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["VELTECH"],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default veltechGearHoarder;
