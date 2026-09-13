import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const allenBeastBeckoner: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YPaL2BxDSN",
  slug: "allen-beast-beckoner",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YPaL2BxDSN:face:default",
      catalogId: "YPaL2BxDSN",
      name: "Allen, Beast Beckoner",
      lineageName: "Allen",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "On Enter: Glimpse 3, then reveal the top card of your deck. If that card is a Harmony or Melody card, put it into your hand.\n\nAs long as you control two or more Animal and/or Beast allies, Allen gets +2 level.",
      abilities: [
        {
          id: "YPaL2BxDSN-a1",
          kind: "triggered",
          text: "On Enter: Glimpse 3, then reveal the top card of your deck. If that card is a Harmony or Melody card, put it into your hand.",
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
                kind: "sequence",
                effects: [
                  {
                    kind: "keyword-action",
                    action: "glimpse",
                    amount: 3,
                  },
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "referenced-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
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
                ],
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["HARMONY", "MELODY"],
                  },
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  destination: {
                    zone: "hand",
                  },
                },
              },
            ],
          },
        },
        {
          id: "YPaL2BxDSN-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control two or more Animal and/or Beast allies, Allen gets +2 level.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "any",
                            filters: [
                              {
                                kind: "subtype",
                                oneOf: ["ANIMAL"],
                              },
                              {
                                kind: "subtype",
                                oneOf: ["BEAST"],
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
                },
              },
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
                property: "level",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default allenBeastBeckoner;
