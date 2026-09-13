import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ritaiGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jbc30d18ys",
  slug: "ritai-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jbc30d18ys:face:default",
      catalogId: "jbc30d18ys",
      name: "Ritai Guard",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "[Class Bonus] Equestrian — As long as you control a Horse ally, Ritai Guard has taunt and vigor. (While awake, this ally with taunt must be targeted before other units you control during your opponent's attack declarations if able. This ally with vigor wakes up at the beginning of your end phase.)",
      abilities: [
        {
          id: "jbc30d18ys-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Equestrian — As long as you control a Horse ally, Ritai Guard has taunt and vigor. (While awake, this ally with taunt must be targeted before other units you control during your opponent's attack declarations if able. This ally with vigor wakes up at the beginning of your end phase.)",
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
                  name: "taunt",
                },
              },
            },
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
                  name: "vigor",
                },
              },
            },
          ],
          label: {
            name: "Equestrian",
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

export default ritaiGuard;
