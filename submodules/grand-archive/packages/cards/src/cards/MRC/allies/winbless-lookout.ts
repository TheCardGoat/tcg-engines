import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const winblessLookout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oqcHHAmYCW",
  slug: "winbless-lookout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oqcHHAmYCW:face:default",
      catalogId: "oqcHHAmYCW",
      name: "Winbless Lookout",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Put a preparation counter on your champion. \n\n[Class Bonus] On Enter: Glimpse 1. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
      abilities: [
        {
          id: "oqcHHAmYCW-a1",
          kind: "triggered",
          text: "On Enter: Put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
        {
          id: "oqcHHAmYCW-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Glimpse 1. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
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
            amount: 1,
          },
        },
      ],
    },
  },
};

export default winblessLookout;
