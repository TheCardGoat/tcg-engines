import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const steadyVerse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sbierp5k1v",
  slug: "steady-verse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sbierp5k1v:face:default",
      catalogId: "sbierp5k1v",
      name: "Steady Verse",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SKILL", "MELODY"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] The next Harmony action card you activate this turn costs 1 less to activate. \n\nDraw a card into your memory.",
      abilities: [
        {
          id: "sbierp5k1v-a1",
          kind: "card-resolution",
          text: "[Class Bonus] The next Harmony action card you activate this turn costs 1 less to activate.",
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
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ACTION"],
                },
                {
                  kind: "subtype",
                  oneOf: ["HARMONY"],
                },
              ],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 1,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
            },
          },
        },
        {
          id: "sbierp5k1v-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
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

export default steadyVerse;
