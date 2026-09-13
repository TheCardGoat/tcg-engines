import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const brewingKit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dwmxz1vdxi",
  slug: "brewing-kit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dwmxz1vdxi:face:default",
      catalogId: "dwmxz1vdxi",
      name: "Brewing Kit",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "REST, Sacrifice three Herbs: Look at the top six cards of your deck. You may reveal a Potion item card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "dwmxz1vdxi-a1",
          kind: "activated",
          text: "REST, Sacrifice three Herbs: Look at the top six cards of your deck. You may reveal a Potion item card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "subtype",
                  oneOf: ["HERB"],
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 6,
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
                  id: "chosen-card",
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
                    binding: "referenced-cards",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["POTION"],
                        },
                      ],
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
                        id: "revealed-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          binding: "chosen-card",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "chosen-card",
                      },
                      destination: {
                        zone: "hand",
                      },
                    },
                  ],
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "ordered-remainder",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  ordered: true,
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                    excluding: ["chosen-card"],
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "ordered-remainder",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
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

export default brewingKit;
