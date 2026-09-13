import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tomeOfIgnorance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dz4qd82liq",
  slug: "tome-of-ignorance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dz4qd82liq:face:default",
      catalogId: "dz4qd82liq",
      name: "Tome of Ignorance",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "DISTORTION", "BOOK"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "[Class Bonus] Champions you don't control get -1 level. (Apply this effect only if your champion's class matches this card's class.)\n\nBanish Tome of Ignorance: Draw a card.",
      abilities: [
        {
          id: "dz4qd82liq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Champions you don't control get -1 level. (Apply this effect only if your champion's class matches this card's class.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
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
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "dz4qd82liq-a2",
          kind: "activated",
          text: "Banish Tome of Ignorance: Draw a card.",
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

export default tomeOfIgnorance;
