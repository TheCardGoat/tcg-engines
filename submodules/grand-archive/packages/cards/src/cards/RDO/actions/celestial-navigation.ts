import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const celestialNavigation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QAU8WVUZM0",
  slug: "celestial-navigation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QAU8WVUZM0:face:default",
      catalogId: "QAU8WVUZM0",
      name: "Celestial Navigation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Glimpse 5. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\nFloating Memory",
      abilities: [
        {
          id: "QAU8WVUZM0-a1",
          kind: "card-resolution",
          text: "Glimpse 5. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 5,
          },
        },
        {
          id: "QAU8WVUZM0-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default celestialNavigation;
