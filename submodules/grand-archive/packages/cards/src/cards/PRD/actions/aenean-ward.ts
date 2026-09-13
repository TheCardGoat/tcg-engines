import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanWard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gqyWZXpxl9",
  slug: "aenean-ward",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gqyWZXpxl9:face:default",
      catalogId: "gqyWZXpxl9",
      name: "Aenean Ward",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "AENEAN", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 2 damage that would be dealt to target unit this turn.\n\n[Class Bonus] [Level 3+] Draw a card. (Apply this effect only if your champion’s class matches this card’s class and only if your champion is level 3 or higher.)",
      abilities: [
        {
          id: "gqyWZXpxl9-a1",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to target unit this turn.",
          targets: [
            {
              id: "target-1",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "gqyWZXpxl9-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 3+] Draw a card. (Apply this effect only if your champion’s class matches this card’s class and only if your champion is level 3 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
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
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default aeneanWard;
