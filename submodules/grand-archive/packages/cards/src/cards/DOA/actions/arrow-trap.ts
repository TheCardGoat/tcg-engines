import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arrowTrap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uoQGe5xGDQ",
  slug: "arrow-trap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uoQGe5xGDQ:face:default",
      catalogId: "uoQGe5xGDQ",
      name: "Arrow Trap",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "RANGER"],
        subtypes: ["ASSASSIN", "RANGER", "SKILL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\nReturn target attacking ally to its owner's hand. Class Bonus: If Arrow Trap was prepared, destroy that ally instead.",
      abilities: [
        {
          id: "uoQGe5xGDQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "uoQGe5xGDQ-a2",
          kind: "card-resolution",
          text: "Return target attacking ally to its owner's hand. Class Bonus: If Arrow Trap was prepared, destroy that ally instead.",
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
            kind: "conditional",
            condition: {
              kind: "all",
              conditions: [
                {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                {
                  kind: "activation-state",
                  state: "prepared",
                },
              ],
            },
            then: {
              kind: "destroy",
              subject: {
                kind: "bound",
                binding: "target-attacking-ally",
              },
            },
            else: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "target-attacking-ally",
              },
              destination: {
                zone: "hand",
              },
            },
          },
        },
      ],
    },
  },
};

export default arrowTrap;
