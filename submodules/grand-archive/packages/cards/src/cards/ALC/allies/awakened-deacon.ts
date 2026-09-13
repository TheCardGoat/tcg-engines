import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const awakenedDeacon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c9p4lpnvx7",
  slug: "awakened-deacon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c9p4lpnvx7:face:default",
      catalogId: "c9p4lpnvx7",
      name: "Awakened Deacon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "As long as you control two or more phantasias, Awakened Deacon has intercept. (Whenever your champion is attacked while this ally with intercept is awake, you may redirect that attack to this ally.)\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "c9p4lpnvx7-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control two or more phantasias, Awakened Deacon has intercept. (Whenever your champion is attacked while this ally with intercept is awake, you may redirect that attack to this ally.)",
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
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "intercept",
                },
              },
            },
          ],
        },
        {
          id: "c9p4lpnvx7-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default awakenedDeacon;
