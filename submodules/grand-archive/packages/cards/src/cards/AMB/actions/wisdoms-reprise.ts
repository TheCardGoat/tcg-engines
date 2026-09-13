import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wisdomsReprise: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lvmj48fn9p",
  slug: "wisdoms-reprise",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lvmj48fn9p:face:default",
      catalogId: "lvmj48fn9p",
      name: "Wisdom's Reprise",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\n[Level 3+] Draw a card into your memory. (Apply this effect only if your champion is level 3 or higher.)",
      abilities: [
        {
          id: "lvmj48fn9p-a1",
          kind: "card-resolution",
          text: "Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
        {
          id: "lvmj48fn9p-a2",
          kind: "card-resolution",
          text: "[Level 3+] Draw a card into your memory. (Apply this effect only if your champion is level 3 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default wisdomsReprise;
