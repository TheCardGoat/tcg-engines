import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionSeal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "om2ry208kk",
  slug: "potion-infusion-seal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "om2ry208kk:face:default",
      catalogId: "om2ry208kk",
      name: "Potion Infusion: Seal",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "Rest target Potion. If you do, it gains “On Sacrifice: Negate target card activation unless its controller pays (2)” until end of turn.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "om2ry208kk-a1",
          kind: "card-resolution",
          text: "Rest target Potion. If you do, it gains “On Sacrifice: Negate target card activation unless its controller pays (2)” until end of turn.",
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
                      id: "granted-gcjbi-a1",
                      kind: "triggered",
                      text: "On Sacrifice: Negate target card activation unless its controller pays (2)",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "object-sacrificed",
                          subject: {
                            kind: "source",
                          },
                        },
                      },
                      targets: [
                        {
                          id: "target-stack-item",
                          kind: "target",
                          declared: "announcement",
                          chooser: "controller",
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          unique: true,
                          candidates: {
                            kind: "stack-item",
                            itemTypes: ["card-activation"],
                          },
                        },
                      ],
                      effect: {
                        kind: "unless-paid",
                        player: {
                          controllerOf: "target-stack-item",
                        },
                        cost: {
                          kind: "pay-reserve",
                          amount: 2,
                        },
                        otherwise: {
                          kind: "negate",
                          subject: {
                            kind: "bound",
                            binding: "target-stack-item",
                          },
                          bindResultAs: "negated-stack-item",
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          id: "om2ry208kk-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default potionInfusionSeal;
