import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const theEternalKingdom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fyoz23yfzk",
  slug: "the-eternal-kingdom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fyoz23yfzk:face:default",
      catalogId: "fyoz23yfzk",
      name: "The Eternal Kingdom",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] Domains you control have reservable. (While paying for a reserve cost, you may rest an object with reservable to pay for 1 of that cost.)\n\nUpkeep — At the beginning of your recollection phase, you may pay (2). If you don't, sacrifice The Eternal Kingdom.",
      abilities: [
        {
          id: "fyoz23yfzk-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Domains you control have reservable. (While paying for a reserve cost, you may rest an object with reservable to pay for 1 of that cost.)",
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
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["DOMAIN"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "reservable",
                },
              },
            },
          ],
        },
        {
          id: "fyoz23yfzk-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, you may pay (2). If you don't, sacrifice The Eternal Kingdom.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "pay",
              player: "controller",
              cost: {
                kind: "pay-reserve",
                amount: 2,
              },
            },
            otherwise: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Upkeep",
          },
        },
      ],
    },
  },
};

export default theEternalKingdom;
