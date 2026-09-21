import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deathEssenceAmulet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ddag7ue0k7",
  slug: "death-essence-amulet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ddag7ue0k7:face:default",
      catalogId: "ddag7ue0k7",
      name: "Death Essence Amulet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "DISTORTION", "BAUBLE"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Whenever an ally you control dies while it's not your turn, you may banish Death Essence Amulet. When you do, look at target opponent's hand or memory and discard a card from it.",
      abilities: [
        {
          id: "ddag7ue0k7-a1",
          kind: "triggered",
          text: "Whenever an ally you control dies while it's not your turn, you may banish Death Essence Amulet. When you do, look at target opponent's hand or memory and discard a card from it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          interveningCondition: {
            kind: "not",
            condition: {
              kind: "turn-player",
              player: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              targets: [
                {
                  id: "target-opponent",
                  kind: "target",
                  declared: "announcement",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "player",
                    players: ["opponent"],
                  },
                },
              ],
              action: {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
              consequence: {
                kind: "select-modes",
                choose: {
                  kind: "exactly",
                  amount: 1,
                },
                modes: [
                  {
                    id: "choose-hand",
                    text: "Look at that opponent's hand and discard a card from it.",
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "look-at",
                          player: "controller",
                          selection: {
                            id: "looked-hand",
                            kind: "choice",
                            declared: "resolution",
                            chooser: "controller",
                            count: {
                              kind: "all",
                            },
                            unique: true,
                            candidates: {
                              kind: "card",
                              zones: ["hand"],
                              relationship: "zone-of",
                              player: {
                                binding: "target-opponent",
                              },
                            },
                          },
                        },
                        {
                          kind: "discard",
                          player: {
                            binding: "target-opponent",
                          },
                          selection: {
                            id: "discarded-from-hand",
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
                              binding: "looked-hand",
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    id: "choose-memory",
                    text: "Look at that opponent's memory and discard a card from it.",
                    effect: {
                      kind: "sequence",
                      effects: [
                        {
                          kind: "look-at",
                          player: "controller",
                          selection: {
                            id: "looked-memory",
                            kind: "choice",
                            declared: "resolution",
                            chooser: "controller",
                            count: {
                              kind: "all",
                            },
                            unique: true,
                            candidates: {
                              kind: "card",
                              zones: ["memory"],
                              relationship: "zone-of",
                              player: {
                                binding: "target-opponent",
                              },
                            },
                          },
                        },
                        {
                          kind: "discard",
                          player: {
                            binding: "target-opponent",
                          },
                          selection: {
                            id: "discarded-from-memory",
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
                              binding: "looked-memory",
                            },
                          },
                        },
                      ],
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
};

export default deathEssenceAmulet;
