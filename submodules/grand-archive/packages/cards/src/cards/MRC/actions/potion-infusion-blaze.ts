import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionBlaze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8bki6fxxgm",
  slug: "potion-infusion-blaze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8bki6fxxgm:face:default",
      catalogId: "8bki6fxxgm",
      name: "Potion Infusion: Blaze",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Rest target Potion. If you do, it gains “On Sacrifice: Deal 4 damage to target attacking ally” until end of turn.",
      abilities: [
        {
          id: "8bki6fxxgm-a1",
          kind: "card-resolution",
          text: "Rest target Potion. If you do, it gains “On Sacrifice: Deal 4 damage to target attacking ally” until end of turn.",
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
                      id: "granted-gip3um-a1",
                      kind: "triggered",
                      text: "On Sacrifice: Deal 4 damage to target attacking ally",
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
                              kind: "all",
                              filters: [
                                {
                                  kind: "type",
                                  oneOf: ["ALLY"],
                                },
                                {
                                  kind: "object-state",
                                  state: "attacking",
                                },
                              ],
                            },
                          },
                        },
                      ],
                      effect: {
                        kind: "deal-damage",
                        source: {
                          kind: "source",
                        },
                        recipient: {
                          kind: "bound",
                          binding: "target-1",
                        },
                        amount: 4,
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

export default potionInfusionBlaze;
