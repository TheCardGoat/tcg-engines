import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionStarlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6qsesw2ugm",
  slug: "potion-infusion-starlight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6qsesw2ugm:face:default",
      catalogId: "6qsesw2ugm",
      name: "Potion Infusion: Starlight",
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
        '[Class Bonus] Starcalling — (1)\n\nRest target Potion. If you do, it gains "On Sacrifice: Until end of turn, your champion gets +4 level" until end of turn. (This trigger would resolve before the Potion\'s ability.)',
      abilities: [
        {
          id: "6qsesw2ugm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Starcalling — (1)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
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
          id: "6qsesw2ugm-a2",
          kind: "card-resolution",
          text: 'Rest target Potion. If you do, it gains "On Sacrifice: Until end of turn, your champion gets +4 level" until end of turn. (This trigger would resolve before the Potion\'s ability.)',
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
                  kind: "subtype",
                  oneOf: ["POTION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "rest",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
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
                    kind: "grant-ability",
                    ability: {
                      id: "granted-44tjzk-a1",
                      kind: "triggered",
                      text: "On Sacrifice: Until end of turn, your champion gets +4 level",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "object-sacrificed",
                          subject: {
                            kind: "source",
                          },
                        },
                      },
                      effect: {
                        kind: "continuous",
                        subjects: {
                          kind: "champion",
                          player: "controller",
                        },
                        affectedSet: "locked",
                        duration: {
                          kind: "this-turn",
                        },
                        layer: {
                          layer: "E",
                          modifies: "stat",
                          sublayer: "modifier",
                        },
                        change: {
                          kind: "numeric",
                          property: "level",
                          operation: "add",
                          amount: 4,
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default potionInfusionStarlight;
