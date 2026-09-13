import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sift: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Qx0kV7SbsN",
  slug: "sift",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Qx0kV7SbsN:face:default",
      catalogId: "Qx0kV7SbsN",
      name: "Sift",
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
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put the top card of your deck into your graveyard. Then draw a card into your memory.",
      abilities: [
        {
          id: "Qx0kV7SbsN-a1",
          kind: "card-resolution",
          text: "Put the top card of your deck into your graveyard. Then draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: 1,
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

export default sift;
