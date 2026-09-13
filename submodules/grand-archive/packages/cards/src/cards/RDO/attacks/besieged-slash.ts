import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const besiegedSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Dkq7QnrGJI",
  slug: "besieged-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Dkq7QnrGJI:face:default",
      catalogId: "Dkq7QnrGJI",
      name: "Besieged Slash",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] As long as an opponent controls three or more units, this card costs 2 less to activate.",
      abilities: [
        {
          id: "Dkq7QnrGJI-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent controls three or more units, this card costs 2 less to activate.",
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
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
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
      ],
    },
  },
};

export default besiegedSlash;
