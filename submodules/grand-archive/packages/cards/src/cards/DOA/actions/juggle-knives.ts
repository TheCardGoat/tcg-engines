import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const juggleKnives: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7VxRE6HgZC",
  slug: "juggle-knives",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7VxRE6HgZC:face:default",
      catalogId: "7VxRE6HgZC",
      name: "Juggle Knives",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "RANGER"],
        subtypes: ["ASSASSIN", "RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to target champion.\n\n[Class Bonus] Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "7VxRE6HgZC-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target champion.",
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
                  oneOf: ["CHAMPION"],
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
          id: "7VxRE6HgZC-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default juggleKnives;
