import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const signaltechXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vFvhZeunOc",
  slug: "signaltech-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vFvhZeunOc:face:default",
      catalogId: "vFvhZeunOc",
      name: "SignalTech X Ultra",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "VELTECH", "PHONE", "DEVICE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: Look at the top three cards of your deck. You may reveal an ally card from among them and put it into your hand. Put the rest on the bottom of your deck in any order. If a card was put into your hand this way, sacrifice SignalTech X Ultra.",
      abilities: [
        {
          id: "vFvhZeunOc-a1",
          kind: "activated",
          text: "REST: Look at the top three cards of your deck. You may reveal an ally card from among them and put it into your hand. Put the rest on the bottom of your deck in any order. If a card was put into your hand this way, sacrifice SignalTech X Ultra.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 3,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-ally",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "chosen-ally",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "up-to",
                          amount: 1,
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "looked-cards",
                          filter: {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-ally",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "chosen-ally",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                    },
                    {
                      kind: "conditional",
                      condition: {
                        kind: "compare",
                        comparison: {
                          left: {
                            kind: "count",
                            collection: {
                              binding: "chosen-ally",
                            },
                          },
                          operator: "eq",
                          right: 1,
                        },
                      },
                      then: {
                        kind: "sacrifice",
                        subject: {
                          kind: "source",
                        },
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

export default signaltechXUltra;
