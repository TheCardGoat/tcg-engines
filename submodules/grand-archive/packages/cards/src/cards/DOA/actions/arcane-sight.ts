import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arcaneSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XLrHaYV9VB",
  slug: "arcane-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XLrHaYV9VB:face:default",
      catalogId: "XLrHaYV9VB",
      name: "Arcane Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText: "Your champion gets +1 level until end of turn.\nDraw a card.",
      abilities: [
        {
          id: "XLrHaYV9VB-a1",
          kind: "card-resolution",
          text: "Your champion gets +1 level until end of turn.\nDraw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
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

export default arcaneSight;
