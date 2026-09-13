import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grandeAiguille: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6ihv6hbvye",
  slug: "grande-aiguille",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6ihv6hbvye:face:default",
      catalogId: "6ihv6hbvye",
      name: "Grande Aiguille",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Ciel Bonus] As long as you have two or more ally omens, Grande Aiguille gets +1POWER. *(An omen is a card in a banishment with an omen counter on it.)",
      abilities: [
        {
          id: "6ihv6hbvye-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] As long as you have two or more ally omens, Grande Aiguille gets +1POWER. *(An omen is a card in a banishment with an omen counter on it.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
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
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "has-counter",
                            counter: "omen",
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
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

export default grandeAiguille;
