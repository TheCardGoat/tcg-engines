import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const simpleSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Zxab4Vi0wx",
  slug: "simple-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Zxab4Vi0wx:face:default",
      catalogId: "Zxab4Vi0wx",
      name: "Simple Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Simple Slime can't attack.\n\nIf damage would be dealt to Simple Slime, prevent 3 of that damage.",
      abilities: [
        {
          id: "Zxab4Vi0wx-a1",
          kind: "static",
          staticKind: "effects",
          text: "Simple Slime can't attack.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "attack",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "Zxab4Vi0wx-a2",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to Simple Slime, prevent 3 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
              operation: {
                kind: "prevent",
                amount: 3,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default simpleSlime;
