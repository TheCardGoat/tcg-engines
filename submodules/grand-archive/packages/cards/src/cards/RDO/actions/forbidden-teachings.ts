import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forbiddenTeachings: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yp4poEZtHt",
  slug: "forbidden-teachings",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yp4poEZtHt:face:default",
      catalogId: "yp4poEZtHt",
      name: "Forbidden Teachings",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "If you control a Book object, glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\nDraw a card.",
      abilities: [
        {
          id: "yp4poEZtHt-a1",
          kind: "card-resolution",
          text: "If you control a Book object, glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["BOOK"],
                },
              },
            },
            then: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 3,
            },
          },
        },
        {
          id: "yp4poEZtHt-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default forbiddenTeachings;
