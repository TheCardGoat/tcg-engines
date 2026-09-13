import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rotundSquirrel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "odv9wh820s",
  slug: "rotund-squirrel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "odv9wh820s:face:default",
      catalogId: "odv9wh820s",
      name: "Rotund Squirrel",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SQUIRREL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText: "Hindered (This ally enters the field rested.)",
      abilities: [
        {
          id: "odv9wh820s-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This ally enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
      ],
    },
  },
};

export default rotundSquirrel;
