import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fourOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xgax8bbjqj",
  slug: "four-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xgax8bbjqj:face:default",
      catalogId: "xgax8bbjqj",
      name: "Four of Hearts",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "GUARDIAN"],
        subtypes: ["ASSASSIN", "GUARDIAN", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Cardistry — (4): Draw a card into your memory, then put a fire or norm element Suited ally card with reserve cost 3 or less from your memory onto the field. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "xgax8bbjqj-a1",
          kind: "activated",
          text: "Cardistry — (4): Draw a card into your memory, then put a fire or norm element Suited ally card with reserve cost 3 or less from your memory onto the field. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
          label: {
            name: "Cardistry",
          },
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: {
              kind: "calculate",
              operator: "maximum",
              operands: [
                {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [
                    4,
                    {
                      kind: "count",
                      collection: {
                        zones: ["field"],
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      },
                      distinctBy: "reserve-cost",
                    },
                  ],
                },
                0,
              ],
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element",
                          oneOf: ["FIRE", "NORM"],
                        },
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "reserve-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 3,
                          },
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SUITED"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-card",
                  },
                  from: "memory",
                  destination: {
                    zone: "field",
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

export default fourOfHearts;
