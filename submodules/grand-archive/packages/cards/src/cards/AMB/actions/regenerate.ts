import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const regenerate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v9ngjjadj4",
  slug: "regenerate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v9ngjjadj4:face:default",
      catalogId: "v9ngjjadj4",
      name: "Regenerate",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "Draw a card into your memory. \n\n[Class Bonus] [Damage 10+] Recover 2.",
      abilities: [
        {
          id: "v9ngjjadj4-a1",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "v9ngjjadj4-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Damage 10+] Recover 2.",
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
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 10,
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default regenerate;
