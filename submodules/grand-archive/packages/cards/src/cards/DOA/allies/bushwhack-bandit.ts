import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bushwhackBandit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kT8CeTFj82",
  slug: "bushwhack-bandit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kT8CeTFj82:face:default",
      catalogId: "kT8CeTFj82",
      name: "Bushwhack Bandit",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Critical 1 (If combat damage would be dealt by a source with critical 1, double that damage unless an opponent discards a card. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "kT8CeTFj82-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Critical 1 (If combat damage would be dealt by a source with critical 1, double that damage unless an opponent discards a card. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "critical",
            value: 1,
          },
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
        },
      ],
    },
  },
};

export default bushwhackBandit;
