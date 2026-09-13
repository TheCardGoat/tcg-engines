import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const twilightSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "62u1231c0z",
  slug: "twilight-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "62u1231c0z:face:default",
      catalogId: "62u1231c0z",
      name: "Twilight Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Pride 3\n\n[Class Bonus] Your champion and other Slime objects you control have spellshroud. (Units with spellshroud can’t be targeted by Spells.)",
      abilities: [
        {
          id: "62u1231c0z-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "62u1231c0z-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Your champion and other Slime objects you control have spellshroud. (Units with spellshroud can’t be targeted by Spells.)",
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
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                      {
                        kind: "not-source",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SLIME"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
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

export default twilightSlime;
