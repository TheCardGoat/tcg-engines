import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const takePoint: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "098kmoi0a5",
  slug: "take-point",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "098kmoi0a5:face:default",
      catalogId: "098kmoi0a5",
      name: "Take Point",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Your champion gains taunt until the beginning of your next turn. (While awake, this unit must be targeted before other units you control during your opponents' attack declarations if able.)\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "098kmoi0a5-a1",
          kind: "card-resolution",
          text: "Your champion gains taunt until the beginning of your next turn. (While awake, this unit must be targeted before other units you control during your opponents' attack declarations if able.)",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "taunt",
              },
            },
          },
        },
        {
          id: "098kmoi0a5-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default takePoint;
