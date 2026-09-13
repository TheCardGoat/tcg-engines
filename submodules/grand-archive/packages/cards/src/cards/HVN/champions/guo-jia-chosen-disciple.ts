import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guoJiaChosenDisciple: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j6dkdoxyqt",
  slug: "guo-jia-chosen-disciple",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j6dkdoxyqt:face:default",
      catalogId: "j6dkdoxyqt",
      name: "Guo Jia, Chosen Disciple",
      lineageName: "Guo Jia",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: If you don't control a Fatestone regalia, reveal all cards in your material deck. Then put a Fatestone regalia card with the lowest memory cost from among them onto the field.",
      abilities: [
        {
          id: "j6dkdoxyqt-a1",
          kind: "triggered",
          text: "On Enter: If you don't control a Fatestone regalia, reveal all cards in your material deck. Then put a Fatestone regalia card with the lowest memory cost from among them onto the field.",
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
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "controls",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FATESTONE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "reveal",
                  player: "controller",
                  selection: {
                    id: "revealed-material-deck",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "all",
                    },
                    candidates: {
                      kind: "card",
                      zones: ["material-deck"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "chosen-fatestone",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    extreme: {
                      property: "memory-cost",
                      operation: "minimum",
                      basis: "base",
                    },
                    candidates: {
                      kind: "card",
                      binding: "revealed-material-deck",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "supertype",
                            oneOf: ["REGALIA"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["FATESTONE"],
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "chosen-fatestone",
                    },
                    from: "material-deck",
                    destination: {
                      zone: "field",
                    },
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

export default guoJiaChosenDisciple;
