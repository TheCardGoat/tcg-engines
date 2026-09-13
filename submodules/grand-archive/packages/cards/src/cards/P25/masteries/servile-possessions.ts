import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const servilePossessions: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "mastery-representation"
> = {
  canonicalId: "0d93t7bfwc",
  slug: "servile-possessions",
  definitionKind: "mastery-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "0d93t7bfwc:face:default",
      catalogId: "0d93t7bfwc",
      name: "Servile Possessions",
      cost: {
        kind: "none",
      },
      typeLine: {
        supertypes: [],
        types: ["MASTERY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Ciel Bonus] Whenever your champion attacks, depending on the amount of omens you have— \n• 1 to 2— That attack gets +1POWER.\n• 3 to 4— That attack gets +2POWER.\n• 5 or more— That attack gets +3POWER. Draw a card into your memory.\n",
      abilities: [
        {
          id: "0d93t7bfwc-a1",
          kind: "triggered",
          text: "[Ciel Bonus] Whenever your champion attacks, depending on the amount of omens you have—\n• 1 to 2— That attack gets +1POWER.\n• 3 to 4— That attack gets +2POWER.\n• 5 or more— That attack gets +3POWER. Draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "variable",
                  symbol: "X",
                },
                operator: "gte",
                right: 1,
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: {
                      kind: "conditional",
                      condition: {
                        kind: "compare",
                        comparison: {
                          left: {
                            kind: "variable",
                            symbol: "X",
                          },
                          operator: "gte",
                          right: 5,
                        },
                      },
                      then: 3,
                      else: {
                        kind: "conditional",
                        condition: {
                          kind: "compare",
                          comparison: {
                            left: {
                              kind: "variable",
                              symbol: "X",
                            },
                            operator: "gte",
                            right: 3,
                          },
                        },
                        then: 2,
                        else: 1,
                      },
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "variable",
                        symbol: "X",
                      },
                      operator: "gte",
                      right: 5,
                    },
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                    to: "memory",
                  },
                },
              ],
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "player-property",
                player: "controller",
                property: "omens",
              },
            },
          ],
        },
      ],
    },
  },
};

export default servilePossessions;
