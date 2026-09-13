import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const quietusBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4c7XZeezka",
  slug: "quietus-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4c7XZeezka:face:default",
      catalogId: "4c7XZeezka",
      name: "Quietus Blade",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        '[Class Bonus] As long as there are no cards in your material deck, Quietus Blade gets +4POWER and has "(3),  REST: Quietus Blade gains spellshroud until end of turn."',
      abilities: [
        {
          id: "4c7XZeezka-a1",
          kind: "static",
          staticKind: "effects",
          text: '[Class Bonus] As long as there are no cards in your material deck, Quietus Blade gets +4POWER and has "(3),  REST: Quietus Blade gains spellshroud until end of turn."',
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
                      zones: ["material-deck"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: 0,
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
                amount: 4,
              },
            },
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
                      zones: ["material-deck"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: 0,
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
                kind: "grant-ability",
                ability: {
                  id: "granted-41yo5p-a1",
                  kind: "activated",
                  text: "(3), REST: Quietus Blade gains spellshroud until end of turn.",
                  activation: "ability",
                  cost: {
                    kind: "all",
                    costs: [
                      {
                        kind: "pay-reserve",
                        amount: 3,
                      },
                      {
                        kind: "rest",
                        subject: {
                          kind: "source",
                        },
                      },
                    ],
                  },
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-turn",
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
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default quietusBlade;
