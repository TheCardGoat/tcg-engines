import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aquaveilAmbusher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TScoOwz80U",
  slug: "aquaveil-ambusher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TScoOwz80U:face:default",
      catalogId: "TScoOwz80U",
      name: "Aquaveil Ambusher",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "GUARDIAN"],
        subtypes: ["ASSASSIN", "GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "[Class Bonus] This card costs 2 less to activate.\n\nAmbush, Retort 2, Stealth",
      abilities: [
        {
          id: "TScoOwz80U-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TScoOwz80U-a2",
          kind: "keyword-group",
          text: "Ambush, Retort 2, Stealth",
          keywords: [
            {
              name: "ambush",
            },
            {
              name: "retort",
              value: 2,
            },
            {
              name: "stealth",
            },
          ],
        },
      ],
    },
  },
};

export default aquaveilAmbusher;
