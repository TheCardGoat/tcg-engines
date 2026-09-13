import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tempestSilverback: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HWFWO0TB8l",
  slug: "tempest-silverback",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HWFWO0TB8l:face:default",
      catalogId: "HWFWO0TB8l",
      name: "Tempest Silverback",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "APE"],
      },
      elements: ["WIND"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)\n\n[Class Bonus] Tempest Silverback gets +2 POWER and +2 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "HWFWO0TB8l-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)",
          keyword: {
            name: "pride",
            value: 5,
          },
        },
        {
          id: "HWFWO0TB8l-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Tempest Silverback gets +2 POWER and +2 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default tempestSilverback;
