import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crowdguardsSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "23ag70F2uz",
  slug: "crowdguards-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "23ag70F2uz:face:default",
      catalogId: "23ag70F2uz",
      name: "Crowdguard's Slash",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] As long as an opponent controls three or more units, Crowdguard's Slash gets +2POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "23ag70F2uz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent controls three or more units, Crowdguard's Slash gets +2POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
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

export default crowdguardsSlash;
