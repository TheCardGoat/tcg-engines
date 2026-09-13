import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const illuminateSecrets: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0ymvddv1au",
  slug: "illuminate-secrets",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0ymvddv1au:face:default",
      catalogId: "0ymvddv1au",
      name: "Illuminate Secrets",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "MAGE"],
        subtypes: ["ASSASSIN", "MAGE", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal an amount of damage to target unit equal to its owner's influence minus your influence. (A player's influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "0ymvddv1au-a1",
          kind: "card-resolution",
          text: "Deal an amount of damage to target unit equal to its owner's influence minus your influence. (A player's influence is equal to the total amount of cards in their hand and memory.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "calculate",
              operator: "subtract",
              operands: [
                {
                  kind: "player-property",
                  player: {
                    ownerOf: "target-1",
                  },
                  property: "influence",
                },
                {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default illuminateSecrets;
