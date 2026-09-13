import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stillwaterPatrol: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LNSRQ5xW6E",
  slug: "stillwater-patrol",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LNSRQ5xW6E:face:default",
      catalogId: "LNSRQ5xW6E",
      name: "Stillwater Patrol",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "True Sight (This ally can attack units with stealth.)\n\nAs long as Stillwater Patrol is attacking a unit with stealth, Stillwater Patrol gets +1 POWER.",
      abilities: [
        {
          id: "LNSRQ5xW6E-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight (This ally can attack units with stealth.)",
          keyword: {
            name: "true-sight",
          },
        },
        {
          id: "LNSRQ5xW6E-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Stillwater Patrol is attacking a unit with stealth, Stillwater Patrol gets +1 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "has-keyword",
                      keyword: "stealth",
                    },
                  ],
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

export default stillwaterPatrol;
