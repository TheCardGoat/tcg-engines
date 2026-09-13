import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const palaceGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k940jhff6v",
  slug: "palace-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k940jhff6v:face:default",
      catalogId: "k940jhff6v",
      name: "Palace Guard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other units you control during your oppent's attack declarations if able.)\n\n[Class Bonus] Retort 2 (As long as this ally is retaliating, it gets +2 POWER.)",
      abilities: [
        {
          id: "k940jhff6v-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other units you control during your oppent's attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "k940jhff6v-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Retort 2 (As long as this ally is retaliating, it gets +2 POWER.)",
          keyword: {
            name: "retort",
            value: 2,
          },
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
        },
      ],
    },
  },
};

export default palaceGuard;
