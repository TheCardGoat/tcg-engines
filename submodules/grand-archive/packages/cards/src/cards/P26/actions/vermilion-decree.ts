import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vermilionDecree: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tjej4mcnqs",
  slug: "vermilion-decree",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tjej4mcnqs:face:default",
      catalogId: "tjej4mcnqs",
      name: "Vermilion Decree",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Imbue 3\n\nChoose one. If Vermilion Decree is imbued, choose two instead—\n• Deal 3 damage to up to one target champion.\n• Deal 2 damage to up to one target ally.\n• Each player draws a card.",
      abilities: [
        {
          id: "tjej4mcnqs-a1",
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
          id: "tjej4mcnqs-a2",
          kind: "card-resolution",
          text: "Choose one. If Vermilion Decree is imbued, choose two instead—\n• Deal 3 damage to up to one target champion.\n• Deal 2 damage to up to one target ally.\n• Each player draws a card.",
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
                text: "Deal 3 damage to up to one target champion.",
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
                        oneOf: ["CHAMPION"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 3,
                },
              },
              {
                id: "mode-2",
                text: "Deal 2 damage to up to one target ally.",
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
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 2,
                },
              },
              {
                id: "mode-3",
                text: "Each player draws a card",
                effect: {
                  kind: "draw",
                  player: "each-player",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default vermilionDecree;
