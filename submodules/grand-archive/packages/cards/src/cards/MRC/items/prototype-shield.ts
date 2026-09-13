import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prototypeShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zadf9q1vk8",
  slug: "prototype-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zadf9q1vk8:face:default",
      catalogId: "zadf9q1vk8",
      name: "Prototype Shield",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\n\n[Class Bonus] If damage would be dealt to linked unit while it’s attacking, prevent 3 of that damage. (This also prevents damage that would be dealt by a retaliating defender.)",
      abilities: [
        {
          id: "zadf9q1vk8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "unit",
          },
        },
        {
          id: "zadf9q1vk8-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If damage would be dealt to linked unit while it’s attacking, prevent 3 of that damage. (This also prevents damage that would be dealt by a retaliating defender.)",
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
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "linked-object",
                },
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "linked-object",
                },
                state: "attacking",
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

export default prototypeShield;
