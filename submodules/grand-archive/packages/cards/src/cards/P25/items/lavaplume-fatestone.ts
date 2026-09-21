import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lavaplumeFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0w5xyjuczy",
  slug: "lavaplume-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "0w5xyjuczy:face:default",
      catalogId: "0w5xyjuczy",
      name: "Lavaplume Fatestone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Fast Activation (You may activate this card at fast speed.)\n\nOn Enter: As a Spell, deal X unpreventable damage to target unit, where X is the amount of other Fatestone and/or Fatebound objects you control.\n \n[Guo Jia Bonus] (4): Transform Lavaplume Fatestone.",
      abilities: [
        {
          id: "0w5xyjuczy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "0w5xyjuczy-a2",
          kind: "triggered",
          text: "On Enter: As a Spell, deal X unpreventable damage to target unit, where X is the amount of other Fatestone and/or Fatebound objects you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-1",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "not-source",
                      },
                      {
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["FATESTONE"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["FATEBOUND"],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: {
                kind: "variable",
                symbol: "X",
              },
              preventable: false,
            },
          },
        },
        {
          id: "0w5xyjuczy-a3",
          kind: "activated",
          text: "[Guo Jia Bonus] (4): Transform Lavaplume Fatestone.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 4,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "0w5xyjuczy:face:flip",
      catalogId: "yyj96p4pm3",
      name: "Firebird Trailblazer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "BIRD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "On Attack: You may discard a card. If you do, draw a card.",
      abilities: [
        {
          id: "yyj96p4pm3-a1",
          kind: "triggered",
          text: "On Attack: You may discard a card. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default lavaplumeFatestone;
