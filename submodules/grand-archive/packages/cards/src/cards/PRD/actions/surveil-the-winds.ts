import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const surveilTheWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xt6uaz6a7g",
  slug: "surveil-the-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xt6uaz6a7g:face:default",
      catalogId: "xt6uaz6a7g",
      name: "Surveil the Winds",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nDraw a card, then put a preparation counter on your champion.",
      abilities: [
        {
          id: "xt6uaz6a7g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        {
          id: "xt6uaz6a7g-a2",
          kind: "card-resolution",
          text: "Draw a card, then put a preparation counter on your champion.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default surveilTheWinds;
