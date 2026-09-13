import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const punishingCartridge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XgzTexcCSA",
  slug: "punishing-cartridge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XgzTexcCSA:face:default",
      catalogId: "XgzTexcCSA",
      name: "Punishing Cartridge",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
      },
      rulesText:
        'Renewable\n\n[Class Bonus] REST: Load Punishing Cartridge into target unloaded Gun weapon you control. \n\nOn Attack: Discard up to two cards, then choose that many—\n• Change the target of this attack to another unit.\n• Punishing Cartridge gains "On Champion Hit: That opponent sacrifices an ally."',
      abilities: [
        {
          id: "XgzTexcCSA-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "XgzTexcCSA-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Load Punishing Cartridge into target unloaded Gun weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                  ],
                },
              },
            },
          ],
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
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "XgzTexcCSA-a3",
          kind: "triggered",
          text: 'On Attack: Discard up to two cards, then choose that many—\n• Change the target of this attack to another unit.\n• Punishing Cartridge gains "On Champion Hit: That opponent sacrifices an ally."',
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
            kind: "sequence",
            effects: [
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card-count",
              },
              {
                kind: "select-modes",
                choose: {
                  kind: "exactly",
                  amount: {
                    kind: "binding-count",
                    binding: "discarded-card-count",
                  },
                },
                modes: [
                  {
                    id: "change-target",
                    text: "Change the target of this attack to another unit.",
                    effect: {
                      kind: "choose",
                      selection: {
                        id: "new-defender",
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
                          relationship: "zone-of",
                          player: "each-player",
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ALLY", "CHAMPION"],
                              },
                              {
                                kind: "not-subject",
                                subject: {
                                  kind: "event-recipient",
                                },
                              },
                            ],
                          },
                        },
                      },
                      effect: {
                        kind: "retarget",
                        subject: {
                          kind: "current-attack",
                        },
                        chooser: "controller",
                        newTarget: {
                          kind: "bound",
                          binding: "new-defender",
                        },
                      },
                    },
                  },
                  {
                    id: "gain-on-champion-hit",
                    text: 'Punishing Cartridge gains "On Champion Hit: That opponent sacrifices an ally."',
                    effect: {
                      kind: "continuous",
                      subjects: {
                        kind: "source",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "this-attack",
                      },
                      layer: {
                        layer: "D",
                        modifies: "ability",
                      },
                      change: {
                        kind: "grant-ability",
                        ability: {
                          id: "granted-57t56v-a1",
                          kind: "triggered",
                          text: "On Champion Hit: That opponent sacrifices an ally.",
                          trigger: {
                            kind: "event",
                            event: {
                              name: "attack-hit",
                              subject: {
                                kind: "ability-bearer",
                              },
                              recipient: {
                                kind: "event-object",
                                filter: {
                                  kind: "type",
                                  oneOf: ["CHAMPION"],
                                },
                              },
                            },
                          },
                          effect: {
                            kind: "choose",
                            selection: {
                              id: "sacrificed-ally",
                              kind: "choice",
                              declared: "resolution",
                              chooser: "event-recipient-controller",
                              count: {
                                kind: "exactly",
                                amount: 1,
                              },
                              candidates: {
                                kind: "object",
                                zones: ["field"],
                                relationship: "controlled-by",
                                player: "event-recipient-controller",
                                filter: {
                                  kind: "type",
                                  oneOf: ["ALLY"],
                                },
                              },
                            },
                            effect: {
                              kind: "sacrifice",
                              subject: {
                                kind: "bound",
                                binding: "sacrificed-ally",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default punishingCartridge;
