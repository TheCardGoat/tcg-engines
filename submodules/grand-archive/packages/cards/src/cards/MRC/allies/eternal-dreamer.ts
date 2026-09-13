import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eternalDreamer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4kj3q2svdv",
  slug: "eternal-dreamer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4kj3q2svdv:face:default",
      catalogId: "4kj3q2svdv",
      name: "Eternal Dreamer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: Glimpse X, where X is Eternal Dreamer’s power. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "4kj3q2svdv-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Glimpse X, where X is Eternal Dreamer’s power. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "source",
                },
                property: "power",
                basis: "current",
              },
            },
          ],
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
            kind: "keyword-action",
            action: "glimpse",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default eternalDreamer;
