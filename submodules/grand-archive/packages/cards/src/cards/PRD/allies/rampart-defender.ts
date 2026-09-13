import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rampartDefender: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Znvu05tvWC",
  slug: "rampart-defender",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Znvu05tvWC:face:default",
      catalogId: "Znvu05tvWC",
      name: "Rampart Defender",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "RANGER"],
        subtypes: ["GUARDIAN", "RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Bulwark  (This ally enters the field with a bulwark counter on it. If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)\n\n[Class Bonus] Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)",
      abilities: [
        {
          id: "Znvu05tvWC-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Bulwark  (This ally enters the field with a bulwark counter on it. If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
          keyword: {
            name: "bulwark",
          },
        },
        {
          id: "Znvu05tvWC-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
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

export default rampartDefender;
