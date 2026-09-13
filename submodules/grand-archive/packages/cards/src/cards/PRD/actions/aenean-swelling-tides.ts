import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanSwellingTides: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "10zrMmtUg2",
  slug: "aenean-swelling-tides",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "10zrMmtUg2:face:default",
      catalogId: "10zrMmtUg2",
      name: "Aenean Swelling Tides",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "AENEAN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 3. (To recover, remove that many damage counters from your champion.)\n\n[Class Bonus] [Level 5+] Recover 3.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "10zrMmtUg2-a1",
          kind: "card-resolution",
          text: "Recover 3. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
        {
          id: "10zrMmtUg2-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 5+] Recover 3.",
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
                  right: 5,
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
        {
          id: "10zrMmtUg2-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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

export default aeneanSwellingTides;
