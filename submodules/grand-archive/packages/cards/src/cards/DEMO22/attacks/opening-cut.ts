import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const openingCut: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vBetRTn3eW",
  slug: "opening-cut",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vBetRTn3eW:face:default",
      catalogId: "vBetRTn3eW",
      name: "Opening Cut",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] As long as you have exactly one card in your memory, Opening Cut gets +2 POWER￰. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "vBetRTn3eW-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you have exactly one card in your memory, Opening Cut gets +2 POWER￰. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default openingCut;
