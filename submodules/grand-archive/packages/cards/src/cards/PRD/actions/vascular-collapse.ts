import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vascularCollapse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WaoGzrPGyd",
  slug: "vascular-collapse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WaoGzrPGyd:face:default",
      catalogId: "WaoGzrPGyd",
      name: "Vascular Collapse",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Choose one—\n• Destroy target non-champion object. \n• [Level 9+] Destroy two target non-champion objects.\n• [Level 15+] Destroy all non-champion objects.",
      abilities: [
        {
          id: "WaoGzrPGyd-a1",
          kind: "card-resolution",
          text: "Choose one—\n• Destroy target non-champion object.\n• [Level 9+] Destroy two target non-champion objects.\n• [Level 15+] Destroy all non-champion objects.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "destroy-one",
                text: "Destroy target non-champion object.",
                targets: [
                  {
                    id: "one-object",
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
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  },
                ],
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "one-object",
                  },
                },
              },
              {
                id: "destroy-two",
                text: "[Level 9+] Destroy two target non-champion objects.",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "gte",
                    right: 9,
                  },
                },
                targets: [
                  {
                    id: "two-objects",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  },
                ],
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "two-objects",
                  },
                },
              },
              {
                id: "destroy-all",
                text: "[Level 15+] Destroy all non-champion objects.",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "gte",
                    right: 15,
                  },
                },
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "each-player",
                      filter: {
                        kind: "not",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
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

export default vascularCollapse;
