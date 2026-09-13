import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const royalBear: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "51l757wvez",
  slug: "royal-bear",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "51l757wvez:face:default",
      catalogId: "51l757wvez",
      name: "Royal Bear",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "BEAR"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)\n\n[Class Bonus] Royal Bear gets +1 POWER and +1 LIFE.",
      abilities: [
        {
          id: "51l757wvez-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "51l757wvez-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Royal Bear gets +1 POWER and +1 LIFE.",
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
                amount: 1,
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default royalBear;
