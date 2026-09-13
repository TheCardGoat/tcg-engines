import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const enragedBoars: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MmbQQdsRhi",
  slug: "enraged-boars",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MmbQQdsRhi:face:default",
      catalogId: "MmbQQdsRhi",
      name: "Enraged Boars",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "BOAR"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText: "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)",
      abilities: [
        {
          id: "MmbQQdsRhi-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)",
          keyword: {
            name: "pride",
            value: 5,
          },
        },
      ],
    },
  },
};

export default enragedBoars;
