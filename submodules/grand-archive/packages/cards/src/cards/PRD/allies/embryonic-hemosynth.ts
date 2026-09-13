import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const embryonicHemosynth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JQQXhhIla9",
  slug: "embryonic-hemosynth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JQQXhhIla9:face:default",
      catalogId: "JQQXhhIla9",
      name: "Embryonic Hemosynth",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Elysian Aura, Spellshroud, Taunt\n\n[Class Bonus] Bulwark (This ally enters the field with a bulwark counter on it. If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
      abilities: [
        {
          id: "JQQXhhIla9-a1",
          kind: "keyword-group",
          text: "Elysian Aura, Spellshroud, Taunt",
          keywords: [
            {
              name: "elysian-aura",
            },
            {
              name: "spellshroud",
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "JQQXhhIla9-a2",
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

export default embryonicHemosynth;
