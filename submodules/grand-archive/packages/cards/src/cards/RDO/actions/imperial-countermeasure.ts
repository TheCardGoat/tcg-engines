import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialCountermeasure: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HRPSt74B7g",
  slug: "imperial-countermeasure",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HRPSt74B7g:face:default",
      catalogId: "HRPSt74B7g",
      name: "Imperial Countermeasure",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["EXALTED", "NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nPrevent the next 4 damage that would be dealt to target unit this turn. Draw a card into your memory.",
      abilities: [
        {
          id: "HRPSt74B7g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "HRPSt74B7g-a2",
          kind: "card-resolution",
          text: "Prevent the next 4 damage that would be dealt to target unit this turn. Draw a card into your memory.",
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
            kind: "sequence",
            effects: [
              {
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
                  amount: 4,
                  scope: "replacement-instance",
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default imperialCountermeasure;
