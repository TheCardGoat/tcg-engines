import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinisterComposure: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IcxG2jsqmu",
  slug: "sinister-composure",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IcxG2jsqmu:face:default",
      catalogId: "IcxG2jsqmu",
      name: "Sinister Composure",
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
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card, then put a preparation counter on your champion. \n\n[Tristan Bonus] If you have agility, put three more preparation counters on your champion.",
      abilities: [
        {
          id: "IcxG2jsqmu-a1",
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
        {
          id: "IcxG2jsqmu-a2",
          kind: "card-resolution",
          text: "[Tristan Bonus] If you have agility, put three more preparation counters on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-state",
              player: "controller",
              state: "agility",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "preparation",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default sinisterComposure;
