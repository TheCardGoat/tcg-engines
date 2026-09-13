import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const backstab: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sxg6WefxIe",
  slug: "backstab",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sxg6WefxIe:face:default",
      catalogId: "sxg6WefxIe",
      name: "Backstab",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] As long as your champion is attacking a rested unit, Backstab gets +2 POWER.",
      abilities: [
        {
          id: "sxg6WefxIe-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion is attacking a rested unit, Backstab gets +2 POWER.",
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
                  kind: "champion",
                  player: "controller",
                },
                otherFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "rested",
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default backstab;
