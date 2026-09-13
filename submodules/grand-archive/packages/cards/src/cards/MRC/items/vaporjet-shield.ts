import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vaporjetShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y208kkz07n",
  slug: "vaporjet-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y208kkz07n:face:default",
      catalogId: "y208kkz07n",
      name: "Vaporjet Shield",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\n\n[Class Bonus] If damage would be dealt to linked unit, prevent 1 of that damage.",
      abilities: [
        {
          id: "y208kkz07n-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "unit",
          },
        },
        {
          id: "y208kkz07n-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If damage would be dealt to linked unit, prevent 1 of that damage.",
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
              operation: {
                kind: "prevent",
                amount: 1,
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

export default vaporjetShield;
