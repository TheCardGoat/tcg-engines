import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionFrostbite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mxz1vdxi74",
  slug: "potion-infusion-frostbite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mxz1vdxi74:face:default",
      catalogId: "mxz1vdxi74",
      name: "Potion Infusion: Frostbite",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        'Rest target Potion. If you do, it gains "On Sacrifice: Rest target unit. The next time that unit would take damage from a water element source this turn, it takes that much damage plus 4 instead" until end of turn. (This trigger would resolve before the Potion\'s ability.)',
      abilities: [
        {
          id: "mxz1vdxi74-a1",
          kind: "card-resolution",
          text: 'Rest target Potion. If you do, it gains "On Sacrifice: Rest target unit. The next time that unit would take damage from a water element source this turn, it takes that much damage plus 4 instead" until end of turn. (This trigger would resolve before the Potion\'s ability.)',
          targets: [
            {
              id: "target-potion",
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
            kind: "reflexive",
            action: {
              kind: "rest",
              subject: {
                kind: "bound",
                binding: "target-potion",
              },
            },
            consequence: {
              kind: "continuous",
              subjects: {
                kind: "bound",
                binding: "target-potion",
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
                  id: "granted-wr0n34-a1",
                  kind: "triggered",
                  text: "On Sacrifice: Rest target unit. The next time that unit would take damage from a water element source this turn, it takes that much damage plus 4 instead.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-sacrificed",
                      subject: {
                        kind: "ability-bearer",
                      },
                    },
                  },
                  targets: [
                    {
                      id: "frostbitten-unit",
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
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "rest",
                        subject: {
                          kind: "bound",
                          binding: "frostbitten-unit",
                        },
                      },
                      {
                        kind: "replacement",
                        event: {
                          name: "damage-dealt",
                          recipient: {
                            kind: "bound-object",
                            binding: "frostbitten-unit",
                          },
                          subject: {
                            kind: "event-object",
                            filter: {
                              kind: "element",
                              oneOf: ["WATER"],
                            },
                          },
                        },
                        limit: {
                          count: 1,
                          per: "object",
                        },
                        operation: {
                          kind: "modify-amount",
                          operation: "add",
                          amount: 4,
                        },
                        duration: {
                          kind: "this-turn",
                        },
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
};

export default potionInfusionFrostbite;
