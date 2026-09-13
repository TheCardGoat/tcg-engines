import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bestialFrenzy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HsaWNAsmAQ",
  slug: "bestial-frenzy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HsaWNAsmAQ:face:default",
      catalogId: "HsaWNAsmAQ",
      name: "Bestial Frenzy",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose one. Class Bonus: Choose up to two instead—\n• Your champion gets +1 level until end of turn.\n• Target Beast ally gets +1 POWER until end of turn.\n• Target Beast ally gains cleave until end of turn.",
      abilities: [
        {
          id: "HsaWNAsmAQ-a1",
          kind: "card-resolution",
          text: "Choose one. Class Bonus: Choose up to two instead—\n• Your champion gets +1 level until end of turn.\n• Target Beast ally gets +1 POWER until end of turn.\n• Target Beast ally gains cleave until end of turn.",
          modes: {
            choose: {
              kind: "between",
              minimum: {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: 0,
                else: 1,
              },
              maximum: {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: 2,
                else: 1,
              },
            },
            declared: "announcement",
            modes: [
              {
                id: "champion-level",
                text: "Your champion gets +1 level until end of turn.",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "champion",
                    player: "controller",
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
                    property: "level",
                    operation: "add",
                    amount: 1,
                  },
                },
              },
              {
                id: "beast-power",
                text: "Target Beast ally gets +1 POWER until end of turn.",
                targets: [
                  {
                    id: "power-beast",
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
                            kind: "subtype",
                            oneOf: ["BEAST"],
                          },
                        ],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "power-beast",
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
                    operation: "add",
                    amount: 1,
                  },
                },
              },
              {
                id: "beast-cleave",
                text: "Target Beast ally gains cleave until end of turn.",
                targets: [
                  {
                    id: "cleave-beast",
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
                            kind: "subtype",
                            oneOf: ["BEAST"],
                          },
                        ],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "cleave-beast",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "cleave",
                    },
                  },
                },
              },
            ],
          },
          effect: {
            kind: "no-op",
          },
        },
      ],
    },
  },
};

export default bestialFrenzy;
