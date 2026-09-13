import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protoArchiveScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kYJUmd11o1",
  slug: "proto-archive-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kYJUmd11o1:face:default",
      catalogId: "kYJUmd11o1",
      name: "Proto Archive Scout",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Proto Archive Scout has stealth as long as it’s awake.\n\nAs long as you control an object named Proto Key Crest, Proto Archive Scout gets +1POWER.",
      abilities: [
        {
          id: "kYJUmd11o1-a1",
          kind: "static",
          staticKind: "effects",
          text: "Proto Archive Scout has stealth as long as it’s awake.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "kYJUmd11o1-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control an object named Proto Key Crest, Proto Archive Scout gets +1POWER.",
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
                        kind: "name",
                        value: "Proto Key Crest",
                        match: "exact",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["CREST"],
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
          ],
        },
      ],
    },
  },
};

export default protoArchiveScout;
