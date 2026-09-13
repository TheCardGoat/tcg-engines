import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ghostHunter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lgl8pux7v9",
  slug: "ghost-hunter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lgl8pux7v9:face:default",
      catalogId: "lgl8pux7v9",
      name: "Ghost Hunter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.) \n\nAs long as Ghost Hunter is attacking an ephemeral ally, it gets +3POWER.",
      abilities: [
        {
          id: "lgl8pux7v9-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "lgl8pux7v9-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Ghost Hunter is attacking an ephemeral ally, it gets +3POWER.",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "ephemeral",
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default ghostHunter;
