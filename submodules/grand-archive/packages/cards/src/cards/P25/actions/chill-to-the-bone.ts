import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chillToTheBone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p00ghqhcpb",
  slug: "chill-to-the-bone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p00ghqhcpb:face:default",
      catalogId: "p00ghqhcpb",
      name: "Chill to the Bone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target attacking ally gets -2 POWER and -2 LIFE until end of turn. If you control two or more phantasias, that ally gets -4 POWER and -4 LIFE until end of turn instead.",
      abilities: [
        {
          id: "p00ghqhcpb-a1",
          kind: "card-resolution",
          text: "Target attacking ally gets -2 POWER and -2 LIFE until end of turn. If you control two or more phantasias, that ally gets -4 POWER and -4 LIFE until end of turn instead.",
          targets: [
            {
              id: "target-attacking-ally",
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
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-attacking-ally",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "subtract",
                  amount: {
                    kind: "conditional",
                    condition: {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "count",
                          collection: {
                            zones: ["field"],
                            player: "controller",
                            filter: {
                              kind: "type",
                              oneOf: ["PHANTASIA"],
                            },
                          },
                        },
                        operator: "gte",
                        right: 2,
                      },
                    },
                    then: 4,
                    else: 2,
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-attacking-ally",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "life",
                  operation: "subtract",
                  amount: {
                    kind: "conditional",
                    condition: {
                      kind: "compare",
                      comparison: {
                        left: {
                          kind: "count",
                          collection: {
                            zones: ["field"],
                            player: "controller",
                            filter: {
                              kind: "type",
                              oneOf: ["PHANTASIA"],
                            },
                          },
                        },
                        operator: "gte",
                        right: 2,
                      },
                    },
                    then: 4,
                    else: 2,
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

export default chillToTheBone;
