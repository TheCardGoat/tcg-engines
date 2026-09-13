import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const benevolentBattlePriest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "776yt8UxhU",
  slug: "benevolent-battle-priest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "776yt8UxhU:face:default",
      catalogId: "776yt8UxhU",
      name: "Benevolent Battle Priest",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] On Attack: Recover 1. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "776yt8UxhU-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Recover 1. (To recover, remove that many damage counters from your champion.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "recover",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default benevolentBattlePriest;
