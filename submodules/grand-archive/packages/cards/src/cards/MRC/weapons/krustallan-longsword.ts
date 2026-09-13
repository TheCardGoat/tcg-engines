import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const krustallanLongsword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cxwjbqjdmt",
  slug: "krustallan-longsword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cxwjbqjdmt:face:default",
      catalogId: "cxwjbqjdmt",
      name: "Krustallan Longsword",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] As long as you have four or more water element cards in your graveyard, Krustallan Longsword gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "cxwjbqjdmt-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you have four or more water element cards in your graveyard, Krustallan Longsword gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 4,
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

export default krustallanLongsword;
