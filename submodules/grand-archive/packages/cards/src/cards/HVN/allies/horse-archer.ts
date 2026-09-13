import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const horseArcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k6d4367ixj",
  slug: "horse-archer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k6d4367ixj:face:default",
      catalogId: "k6d4367ixj",
      name: "Horse Archer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nEquestrian — As long as you control a Horse ally, Horse Archer has ranged 3. (Multiple instances of ranged stack.)",
      abilities: [
        {
          id: "k6d4367ixj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
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
        },
        {
          id: "k6d4367ixj-a2",
          kind: "static",
          staticKind: "effects",
          text: "Equestrian — As long as you control a Horse ally, Horse Archer has ranged 3. (Multiple instances of ranged stack.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
                  },
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
                  name: "ranged",
                  value: 3,
                },
              },
            },
          ],
          label: {
            name: "Equestrian",
          },
        },
      ],
    },
  },
};

export default horseArcher;
