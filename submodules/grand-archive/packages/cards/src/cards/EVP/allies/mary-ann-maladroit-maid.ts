import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maryAnnMaladroitMaid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mt5zs1w6c0",
  slug: "mary-ann-maladroit-maid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mt5zs1w6c0:face:default",
      catalogId: "mt5zs1w6c0",
      name: "Mary Ann, Maladroit Maid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "Mary Ann gets +1POWER for each omen you have with different reserve costs.\n\nMary Ann has vigor as long as one of your omens has vigor. The same is true for ambush, intercept, steadfast, stealth, spellshroud, taunt, and true sight.",
      abilities: [
        {
          id: "mt5zs1w6c0-a1",
          kind: "static",
          staticKind: "effects",
          text: "Mary Ann gets +1POWER for each omen you have with different reserve costs.",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "has-counter",
                      counter: "omen",
                    },
                  },
                  distinctBy: "reserve-cost",
                },
              },
            },
          ],
        },
        {
          id: "mt5zs1w6c0-a2",
          kind: "static",
          staticKind: "effects",
          text: "Mary Ann has vigor as long as one of your omens has vigor. The same is true for ambush, intercept, steadfast, stealth, spellshroud, taunt, and true sight.",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "vigor",
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
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "ambush",
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
                  name: "ambush",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "intercept",
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
                  name: "intercept",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "steadfast",
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
                  name: "steadfast",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "stealth",
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
                  name: "stealth",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "spellshroud",
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
                  name: "spellshroud",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "taunt",
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
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "has-counter",
                        counter: "omen",
                      },
                      {
                        kind: "has-keyword",
                        keyword: "true-sight",
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
                  name: "true-sight",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default maryAnnMaladroitMaid;
