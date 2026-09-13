import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const verdigrisDecree: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7cx66hjlgx",
  slug: "verdigris-decree",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7cx66hjlgx:face:default",
      catalogId: "7cx66hjlgx",
      name: "Verdigris Decree",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 3\n\nChoose one. If Verdigris Decree is imbued, choose two instead—\n• Suppress up to one target ally.\n• Up to one target ally gets +2 POWER until end of turn.\n• Destroy up to one target phantasia.",
      abilities: [
        {
          id: "7cx66hjlgx-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "7cx66hjlgx-a2",
          kind: "card-resolution",
          text: "Choose one. If Verdigris Decree is imbued, choose two instead—\n• Suppress up to one target ally.\n• Up to one target ally gets +2 POWER until end of turn.\n• Destroy up to one target phantasia.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "imbued",
                },
                then: 2,
                else: 1,
              },
            },
            modes: [
              {
                id: "mode-1",
                text: "Suppress up to one target ally.",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "keyword-action",
                  action: "suppress",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                },
              },
              {
                id: "mode-2",
                text: "Up to one target ally gets +2 POWER until end of turn.",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
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
                    amount: 2,
                  },
                },
              },
              {
                id: "mode-3",
                text: "Destroy up to one target phantasia",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
                    chooser: "controller",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["PHANTASIA"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
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

export default verdigrisDecree;
