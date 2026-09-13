import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfFlock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vp83TimzWT",
  slug: "greater-boon-of-flock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vp83TimzWT:face:default",
      catalogId: "vp83TimzWT",
      name: "Greater Boon of Flock",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        'Whenever a Bird ally enters the field under your control, if it wasn\'t summoned by this ability, cascade— \n• 1 to 4— Summon a Fledgling token.\n• 5 to 9— Put a buff counter on a Bird ally you control.\n• 10— Greater Boon of Flock gains "Birds you control get +1POWER and have vigor."\n(This ability changes each cascade.)\n',
      abilities: [
        {
          id: "vp83TimzWT-a1",
          kind: "triggered",
          text: 'Whenever a Bird ally enters the field under your control, if it wasn\'t summoned by this ability, cascade—\n• 1 to 4— Summon a Fledgling token.\n• 5 to 9— Put a buff counter on a Bird ally you control.\n• 10— Greater Boon of Flock gains "Birds you control get +1POWER and have vigor."\n(This ability changes each cascade.)',
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BIRD"],
                    },
                  ],
                },
              },
              causeNot: {
                kind: "ability",
                ability: "this",
              },
            },
          },
          cascade: {
            kind: "cascade",
            advanceOn: "trigger",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "Summon a Fledgling token.",
                counts: [1, 4],
                effect: {
                  kind: "summon",
                  object: "Fledgling",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
              {
                id: "cascade-2",
                text: "Put a buff counter on a Bird ally you control.",
                counts: [5, 9],
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
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                id: "cascade-3",
                text: 'Greater Boon of Flock gains "Birds you control get +1POWER and have vigor."',
                counts: [10],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-ability",
                    ability: {
                      id: "granted-vmnt3s-a1",
                      kind: "static",
                      staticKind: "effects",
                      text: "Birds you control get +1POWER and have vigor.",
                      effects: [
                        {
                          kind: "continuous",
                          subjects: {
                            kind: "each",
                            collection: {
                              zones: ["field"],
                              player: "controller",
                              filter: {
                                kind: "all",
                                filters: [
                                  {
                                    kind: "subtype",
                                    oneOf: ["BIRD"],
                                  },
                                ],
                              },
                            },
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
                            amount: 1,
                          },
                        },
                        {
                          kind: "continuous",
                          subjects: {
                            kind: "each",
                            collection: {
                              zones: ["field"],
                              player: "controller",
                              filter: {
                                kind: "all",
                                filters: [
                                  {
                                    kind: "subtype",
                                    oneOf: ["BIRD"],
                                  },
                                ],
                              },
                            },
                          },
                          affectedSet: "dynamic",
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
                      ],
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

export default greaterBoonOfFlock;
