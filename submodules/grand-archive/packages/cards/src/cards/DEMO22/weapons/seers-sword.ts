import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seersSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XQKyUqsMUg",
  slug: "seers-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XQKyUqsMUg:face:default",
      catalogId: "XQKyUqsMUg",
      name: "Seer's Sword",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: Glimpse 2. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "XQKyUqsMUg-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Glimpse 2. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
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
            kind: "keyword-action",
            action: "glimpse",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default seersSword;
