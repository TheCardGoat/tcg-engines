import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const owlFamiliar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WShYN9M3lU",
  slug: "owl-familiar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WShYN9M3lU:face:default",
      catalogId: "WShYN9M3lU",
      name: "Owl Familiar",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE", "TAMER"],
        subtypes: ["MAGE", "TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Glimpse 2. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "WShYN9M3lU-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Glimpse 2. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order. Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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

export default owlFamiliar;
