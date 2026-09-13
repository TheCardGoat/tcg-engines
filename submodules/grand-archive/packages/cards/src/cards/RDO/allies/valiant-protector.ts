import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const valiantProtector: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k21JAm6joz",
  slug: "valiant-protector",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k21JAm6joz:face:default",
      catalogId: "k21JAm6joz",
      name: "Valiant Protector",
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
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Bulwark (This ally enters the field with a bulwark counter on it. If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
      abilities: [
        {
          id: "k21JAm6joz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Bulwark (This ally enters the field with a bulwark counter on it. If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
          keyword: {
            name: "bulwark",
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

export default valiantProtector;
