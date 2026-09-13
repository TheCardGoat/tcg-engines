import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lakesideSerpent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "krgjMyVHRd",
  slug: "lakeside-serpent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "krgjMyVHRd:face:default",
      catalogId: "krgjMyVHRd",
      name: "Lakeside Serpent",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SERPENT"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 5,
      },
      rulesText:
        "Pride 6 (This ally won't obey you unless your champion is level 6 or higher.)\n\n[Class Bonus] Lakeside Serpent gets +1 POWER for each water element card in your graveyard. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "krgjMyVHRd-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 6 (This ally won't obey you unless your champion is level 6 or higher.)",
          keyword: {
            name: "pride",
            value: 6,
          },
        },
        {
          id: "krgjMyVHRd-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Lakeside Serpent gets +1 POWER for each water element card in your graveyard. (Apply this effect only if your champion's class matches this card's class.)",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
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

export default lakesideSerpent;
