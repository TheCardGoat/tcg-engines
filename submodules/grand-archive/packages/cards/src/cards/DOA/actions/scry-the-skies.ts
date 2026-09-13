import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scryTheSkies: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "F9POfB5Nah",
  slug: "scry-the-skies",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "F9POfB5Nah:face:default",
      catalogId: "F9POfB5Nah",
      name: "Scry the Skies",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Glimpse LV. Draw a card into your memory. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "F9POfB5Nah-a1",
          kind: "card-resolution",
          text: "Glimpse LV. Draw a card into your memory. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default scryTheSkies;
