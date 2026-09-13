import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tomeOfKnowledge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yDARN8eV6B",
  slug: "tome-of-knowledge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yDARN8eV6B:face:default",
      catalogId: "yDARN8eV6B",
      name: "Tome of Knowledge",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BOOK"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] Your champion gets +1 level. (Apply this effect only if your champion's class matches this card's class.)\n\nBanish Tome of Knowledge: Draw a card. ",
      abilities: [
        {
          id: "yDARN8eV6B-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Your champion gets +1 level. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "yDARN8eV6B-a2",
          kind: "activated",
          text: "Banish Tome of Knowledge: Draw a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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

export default tomeOfKnowledge;
