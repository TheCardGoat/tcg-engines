import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ionizedAsceticism: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u2Peefob8w",
  slug: "ionized-asceticism",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u2Peefob8w:face:default",
      catalogId: "u2Peefob8w",
      name: "Ionized Asceticism",
      cost: {
        kind: "reserve",
        amount: 15,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Rai Bonus] Efficiency \n\nBanish all cards from your hand and memory, then draw seven cards. Until the beginning of your next turn, your champion gets -10 level.",
      abilities: [
        {
          id: "u2Peefob8w-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Rai Bonus] Efficiency",
          keyword: {
            name: "efficiency",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Rai",
              },
            },
          ],
        },
        {
          id: "u2Peefob8w-a2",
          kind: "card-resolution",
          text: "Banish all cards from your hand and memory, then draw seven cards. Until the beginning of your next turn, your champion gets -10 level.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["hand", "memory"],
                    player: "controller",
                  },
                },
                destination: {
                  zone: "banishment",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 7,
              },
              {
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
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "level",
                  operation: "subtract",
                  amount: 10,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default ionizedAsceticism;
