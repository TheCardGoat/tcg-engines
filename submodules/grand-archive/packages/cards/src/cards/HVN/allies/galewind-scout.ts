import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galewindScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8gv9f4a0nk",
  slug: "galewind-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8gv9f4a0nk:face:default",
      catalogId: "8gv9f4a0nk",
      name: "Galewind Scout",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "Ranged 3 (As long as this unit is distant, its attacks get +3 POWER.)",
      abilities: [
        {
          id: "8gv9f4a0nk-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3 (As long as this unit is distant, its attacks get +3 POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
      ],
    },
  },
};

export default galewindScout;
