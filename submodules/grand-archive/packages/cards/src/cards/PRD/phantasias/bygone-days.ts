import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bygoneDays: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wXNDSNQ2x2",
  slug: "bygone-days",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wXNDSNQ2x2:face:default",
      catalogId: "wXNDSNQ2x2",
      name: "Bygone Days",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, cascade— \n• 1— Recover 2.\n• 2— Recover 1.\n• 3— Each player chooses an ally they control and returns it to its owner's memory. Sacrifice Bygone Days.\n(This ability changes each cascade.)",
      abilities: [
        {
          id: "wXNDSNQ2x2-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, cascade—\n• 1— Recover 2.\n• 2— Recover 1.\n• 3— Each player chooses an ally they control and returns it to its owner's memory. Sacrifice Bygone Days.\n(This ability changes each cascade.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
                text: "Recover 2.",
                counts: [1],
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 2,
                },
              },
              {
                id: "cascade-2",
                text: "Recover 1.",
                counts: [2],
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                id: "cascade-3",
                text: "Each player chooses an ally they control and returns it to its owner's memory. Sacrifice Bygone Days.",
                counts: [3],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "for-each-player",
                      players: "each-player",
                      bindEachAs: "cascade-player",
                      effect: {
                        kind: "choose",
                        selection: {
                          id: "returned-ally",
                          kind: "choice",
                          declared: "resolution",
                          chooser: {
                            binding: "cascade-player",
                          },
                          count: {
                            kind: "exactly",
                            amount: 1,
                          },
                          unique: true,
                          candidates: {
                            kind: "object",
                            zones: ["field"],
                            relationship: "controlled-by",
                            player: {
                              binding: "cascade-player",
                            },
                            filter: {
                              kind: "type",
                              oneOf: ["ALLY"],
                            },
                          },
                        },
                        effect: {
                          kind: "move",
                          subject: {
                            kind: "bound",
                            binding: "returned-ally",
                          },
                          from: "field",
                          destination: {
                            zone: "memory",
                          },
                        },
                      },
                    },
                    {
                      kind: "sacrifice",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default bygoneDays;
