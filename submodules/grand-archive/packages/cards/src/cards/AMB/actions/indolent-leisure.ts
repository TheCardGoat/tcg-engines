import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const indolentLeisure: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "29bvfw3te2",
  slug: "indolent-leisure",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "29bvfw3te2:face:default",
      catalogId: "29bvfw3te2",
      name: "Indolent Leisure",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Draw a card. \n\n[Class Bonus] [Level 3+] Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 3 or higher.)",
      abilities: [
        {
          id: "29bvfw3te2-a1",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "29bvfw3te2-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 3+] Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 3 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default indolentLeisure;
