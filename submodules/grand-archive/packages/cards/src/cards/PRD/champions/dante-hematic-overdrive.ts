import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const danteHematicOverdrive: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MG4zUMPqIC",
  slug: "dante-hematic-overdrive",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MG4zUMPqIC:face:default",
      catalogId: "MG4zUMPqIC",
      name: "Dante, Hematic Overdrive",
      lineageName: "Dante",
      cost: {
        kind: "memory",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        level: 4,
        life: 28,
      },
      rulesText:
        'Dante Lineage\n\nOn Enter: You gain the Divine Comedy mastery. For the rest of the game, Dante has "At the beginning of your end phase, sacrifice an Elysian object or banish an Elysian card from your hand or memory. If you do neither, destroy Dante."\n\nAt the beginning of each player\'s end phase, if Dante was dealt damage this turn, recover 7.',
      abilities: [
        {
          id: "MG4zUMPqIC-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Dante Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Dante",
          },
        },
        {
          id: "MG4zUMPqIC-a2",
          kind: "triggered",
          text: 'On Enter: You gain the Divine Comedy mastery. For the rest of the game, Dante has "At the beginning of your end phase, sacrifice an Elysian object or banish an Elysian card from your hand or memory. If you do neither, destroy Dante."',
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "gain-mastery",
                player: "controller",
                mastery: "Divine Comedy",
              },
              {
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
                    id: "granted-fsifh2-a1",
                    kind: "triggered",
                    text: "At the beginning of your end phase, sacrifice an Elysian object or banish an Elysian card from your hand or memory. If you do neither, destroy Dante.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "phase-begins",
                        phase: "end",
                        actor: "controller",
                      },
                    },
                    effect: {
                      kind: "unless-performed",
                      player: "controller",
                      alternative: {
                        kind: "select-modes",
                        choose: {
                          kind: "exactly",
                          amount: 1,
                        },
                        modes: [
                          {
                            id: "sacrifice-elysian",
                            text: "Sacrifice an Elysian object.",
                            effect: {
                              kind: "choose",
                              selection: {
                                id: "sacrificed-elysian",
                                kind: "choice",
                                declared: "resolution",
                                chooser: "controller",
                                count: {
                                  kind: "exactly",
                                  amount: 1,
                                },
                                candidates: {
                                  kind: "object",
                                  zones: ["field"],
                                  relationship: "controlled-by",
                                  player: "controller",
                                  filter: {
                                    kind: "subtype",
                                    oneOf: ["ELYSIAN"],
                                  },
                                },
                              },
                              effect: {
                                kind: "sacrifice",
                                subject: {
                                  kind: "bound",
                                  binding: "sacrificed-elysian",
                                },
                              },
                            },
                          },
                          {
                            id: "banish-elysian",
                            text: "Banish an Elysian card from your hand or memory.",
                            effect: {
                              kind: "banish",
                              player: "controller",
                              selection: {
                                id: "banished-elysian",
                                kind: "choice",
                                declared: "resolution",
                                chooser: "controller",
                                count: {
                                  kind: "exactly",
                                  amount: 1,
                                },
                                unique: true,
                                candidates: {
                                  kind: "card",
                                  zones: ["hand", "memory"],
                                  relationship: "zone-of",
                                  player: "controller",
                                  filter: {
                                    kind: "subtype",
                                    oneOf: ["ELYSIAN"],
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                      otherwise: {
                        kind: "destroy",
                        subject: {
                          kind: "ability-bearer",
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
          id: "MG4zUMPqIC-a3",
          kind: "triggered",
          text: "At the beginning of each player's end phase, if Dante was dealt damage this turn, recover 7.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "damage-dealt",
              window: "this-turn",
              recipient: {
                kind: "source",
              },
              minimum: 1,
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: 7,
            },
          },
        },
      ],
    },
  },
};

export default danteHematicOverdrive;
