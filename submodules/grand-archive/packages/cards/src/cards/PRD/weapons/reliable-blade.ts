import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reliableBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LtwQoptWzR",
  slug: "reliable-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LtwQoptWzR:face:default",
      catalogId: "LtwQoptWzR",
      name: "Reliable Blade",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] As long as you have three or more advanced element cards in your banishment, Reliable Blade has spellshroud. (An object with spellshroud can't be targeted by Spells.)",
      abilities: [
        {
          id: "LtwQoptWzR-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you have three or more advanced element cards in your banishment, Reliable Blade has spellshroud. (An object with spellshroud can't be targeted by Spells.)",
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
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "element-category",
                        value: "advanced",
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "spellshroud",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default reliableBlade;
