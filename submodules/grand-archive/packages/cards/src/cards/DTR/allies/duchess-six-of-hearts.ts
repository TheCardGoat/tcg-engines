import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const duchessSixOfHearts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qzv380ujf5",
  slug: "duchess-six-of-hearts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qzv380ujf5:face:default",
      catalogId: "qzv380ujf5",
      name: "Duchess, Six of Hearts",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SUITED", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 2,
      },
      rulesText:
        "Kindle 6\n\nCardistry — (6): Banish a fire element action card with reserve cost 2 or less from your graveyard. If you do, copy it and you may activate that copy without paying its reserve cost. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
      abilities: [
        {
          id: "qzv380ujf5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 6",
          keyword: {
            name: "kindle",
            value: 6,
          },
        },
        {
          id: "qzv380ujf5-a2",
          kind: "activated",
          text: "Cardistry — (6): Banish a fire element action card with reserve cost 2 or less from your graveyard. If you do, copy it and you may activate that copy without paying its reserve cost. This ability costs (1) less to activate for each Suited object you control with different reserve costs. Activate this ability only once.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 6,
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
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
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "banished-action",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                    {
                      kind: "element",
                      oneOf: ["FIRE"],
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
                        right: 2,
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-action",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ACTION"],
                          },
                          {
                            kind: "element",
                            oneOf: ["FIRE"],
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
                              right: 2,
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  kind: "copy",
                  subject: {
                    kind: "bound",
                    binding: "banished-action",
                  },
                  copy: "card-activation",
                  bindResultAs: "copied-action",
                },
                {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "activate-card",
                    subject: {
                      kind: "bound",
                      binding: "copied-action",
                    },
                    payCosts: false,
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

export default duchessSixOfHearts;
