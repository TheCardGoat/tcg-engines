import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeEnsoul: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CQ1bxUyi0Q",
  slug: "spirit-blade-ensoul",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CQ1bxUyi0Q:face:default",
      catalogId: "CQ1bxUyi0Q",
      name: "Spirit Blade: Ensoul",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose any amount of Sword weapon cards with memory cost 1 or less from your banishment and/or material deck and put them onto the field. Until end of turn, Sword weapons you control can attack as though they were allies. At the beginning of your next end phase, sacrifice all Sword weapons you control.",
      abilities: [
        {
          id: "CQ1bxUyi0Q-a1",
          kind: "card-resolution",
          text: "Choose any amount of Sword weapon cards with memory cost 1 or less from your banishment and/or material deck and put them onto the field. Until end of turn, Sword weapons you control can attack as though they were allies. At the beginning of your next end phase, sacrifice all Sword weapons you control.",
          effect: {
            kind: "choose",
            selection: {
              id: "sword-weapons",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "union",
                sources: [
                  {
                    kind: "card",
                    zones: ["banishment"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 1,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "sword-weapons",
                  },
                  destination: {
                    zone: "field",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "attack-as-ally",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["WEAPON"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["SWORD"],
                          },
                        ],
                      },
                    },
                  },
                  duration: {
                    kind: "this-turn",
                  },
                },
                {
                  kind: "create-delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "phase-begins",
                      phase: "end",
                      actor: "controller",
                    },
                  },
                  limit: 1,
                  expires: {
                    kind: "until-end-of-next-phase",
                    phase: "end",
                    whose: "controller",
                  },
                  effect: {
                    kind: "sacrifice",
                    subject: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "type",
                              oneOf: ["WEAPON"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["SWORD"],
                            },
                          ],
                        },
                      },
                    },
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

export default spiritBladeEnsoul;
