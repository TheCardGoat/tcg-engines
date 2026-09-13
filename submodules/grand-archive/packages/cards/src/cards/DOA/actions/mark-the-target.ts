import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const markTheTarget: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LRsgl92Iqa",
  slug: "mark-the-target",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LRsgl92Iqa:face:default",
      catalogId: "LRsgl92Iqa",
      name: "Mark the Target",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "RANGER"],
        subtypes: ["ASSASSIN", "RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to target unit.\n\n[Class Bonus] Put a preparation counter on your champion. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "LRsgl92Iqa-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit.",
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
            amount: 1,
          },
        },
        {
          id: "LRsgl92Iqa-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put a preparation counter on your champion. (Apply this effect only if your champion's class matches this card's class.)",
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default markTheTarget;
