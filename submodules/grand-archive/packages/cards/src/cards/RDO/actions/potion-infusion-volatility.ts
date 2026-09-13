import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionVolatility: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ndnEl5mq7W",
  slug: "potion-infusion-volatility",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ndnEl5mq7W:face:default",
      catalogId: "ndnEl5mq7W",
      name: "Potion Infusion: Volatility",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        '[Arisanna Bonus] Efficiency\n\nRest target Potion. If you do, it gains "On Sacrifice: Deal 4+D6 damage to each champion you don\'t control" until end of turn. (Roll a six-sided die to determine each instance of D6 as this effect resolves.)',
      abilities: [
        {
          id: "ndnEl5mq7W-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Arisanna Bonus] Efficiency",
          keyword: {
            name: "efficiency",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
        },
        {
          id: "ndnEl5mq7W-a2",
          kind: "card-resolution",
          text: 'Rest target Potion. If you do, it gains "On Sacrifice: Deal 4+D6 damage to each champion you don\'t control" until end of turn. (Roll a six-sided die to determine each instance of D6 as this effect resolves.)',
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
                      id: "granted-1er67ae-a1",
                      kind: "triggered",
                      text: "On Sacrifice: Deal 4+D6 damage to each champion you don't control",
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
                        kind: "deal-damage",
                        source: {
                          kind: "source",
                        },
                        recipient: {
                          kind: "each",
                          collection: {
                            zones: ["field"],
                            player: "each-opponent",
                            filter: {
                              kind: "type",
                              oneOf: ["CHAMPION"],
                            },
                          },
                        },
                        amount: {
                          kind: "calculate",
                          operator: "add",
                          operands: [
                            4,
                            {
                              kind: "die",
                              sides: 6,
                            },
                          ],
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

export default potionInfusionVolatility;
