import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const astraSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zuj68m69iq",
  slug: "astra-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zuj68m69iq:face:default",
      catalogId: "zuj68m69iq",
      name: "Astra Sight",
      cost: {
        kind: "reserve",
        amount: 0,
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
        "Starcalling — (0) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)\n\nGlimpse 1, then draw a card.",
      abilities: [
        {
          id: "zuj68m69iq-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (0) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 0,
            },
          },
        },
        {
          id: "zuj68m69iq-a2",
          kind: "card-resolution",
          text: "Glimpse 1, then draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 1,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default astraSight;
