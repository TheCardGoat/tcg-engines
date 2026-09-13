import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swervingSpring: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vj6vmuuldt",
  slug: "swerving-spring",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vj6vmuuldt:face:default",
      catalogId: "vj6vmuuldt",
      name: "Swerving Spring",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 2 damage that would be dealt to target unit this turn.\n\n[Class Bonus] Put a preparation counter on your champion. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "vj6vmuuldt-a1",
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
          id: "vj6vmuuldt-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put a preparation counter on your champion. (Apply this effect only if your champion’s class matches this card’s class.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default swervingSpring;
