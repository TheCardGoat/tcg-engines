import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const meteorStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dwavcoxpnj",
  slug: "meteor-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dwavcoxpnj:face:default",
      catalogId: "dwavcoxpnj",
      name: "Meteor Strike",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Starcalling — (3) \n\nAs long as Meteor Strike is being starcalled, it has “Deal 3 damage to all units except for your champion.” Otherwise, it has “Destroy target non-champion object.” ",
      abilities: [
        {
          id: "dwavcoxpnj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (3)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
          },
        },
        {
          id: "dwavcoxpnj-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Meteor Strike is being starcalled, it has “Deal 3 damage to all units except for your champion.” Otherwise, it has “Destroy target non-champion object.”",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "starcalled",
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
                  id: "granted-yd5eha-a1",
                  kind: "card-resolution",
                  text: "Deal 3 damage to all units except for your champion.",
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "ability-bearer",
                    },
                    recipient: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["ALLY", "CHAMPION"],
                            },
                            {
                              kind: "not-subject",
                              subject: {
                                kind: "champion",
                                player: "controller",
                              },
                            },
                          ],
                        },
                      },
                    },
                    amount: 3,
                  },
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
                kind: "not",
                condition: {
                  kind: "activation-state",
                  state: "starcalled",
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
                  id: "granted-8uz0l4-a1",
                  kind: "card-resolution",
                  text: "Destroy target non-champion object.",
                  targets: [
                    {
                      id: "destroyed-object",
                      kind: "target",
                      declared: "announcement",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      unique: true,
                      candidates: {
                        kind: "object",
                        zones: ["field"],
                        filter: {
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                      },
                    },
                  ],
                  effect: {
                    kind: "destroy",
                    subject: {
                      kind: "bound",
                      binding: "destroyed-object",
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

export default meteorStrike;
