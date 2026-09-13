import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const armedSquallguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e7782pjg1d",
  slug: "armed-squallguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e7782pjg1d:face:default",
      catalogId: "e7782pjg1d",
      name: "Armed Squallguard",
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
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "As long as you have one or more attack omens, Armed Squallguard gets +1POWER.\n\nAs long as you have one or more ally omens, Armed Squallguard gets +1LIFE.",
      abilities: [
        {
          id: "e7782pjg1d-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have one or more attack omens, Armed Squallguard gets +1POWER.",
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
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ATTACK"],
                          },
                          {
                            kind: "has-counter",
                            counter: "omen",
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 1,
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
          ],
        },
        {
          id: "e7782pjg1d-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have one or more ally omens, Armed Squallguard gets +1LIFE.",
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
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "has-counter",
                            counter: "omen",
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 1,
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
        },
      ],
    },
  },
};

export default armedSquallguard;
