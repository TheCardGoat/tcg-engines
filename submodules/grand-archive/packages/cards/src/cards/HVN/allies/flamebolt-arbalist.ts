import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flameboltArbalist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5yw862q547",
  slug: "flamebolt-arbalist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5yw862q547:face:default",
      catalogId: "5yw862q547",
      name: "Flamebolt Arbalist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText: "Ranged 4 (As long as this unit is distant, its attacks get +4 power.)",
      abilities: [
        {
          id: "5yw862q547-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 4 (As long as this unit is distant, its attacks get +4 power.)",
          keyword: {
            name: "ranged",
            value: 4,
          },
        },
      ],
    },
  },
};

export default flameboltArbalist;
