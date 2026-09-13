import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rondoOfTheWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4hbW1LvBRr",
  slug: "rondo-of-the-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4hbW1LvBRr:face:default",
      catalogId: "4hbW1LvBRr",
      name: "Rondo of the Wind",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SKILL", "MELODY"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\nScavenge 6 for an ally card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
      abilities: [
        {
          id: "4hbW1LvBRr-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4hbW1LvBRr-a2",
          kind: "card-resolution",
          text: "Scavenge 6 for an ally card. (To scavenge an amount, reveal cards from the top of your deck until you reveal that many cards or until you reveal the specified card. Put the specified card into your hand and the rest on the bottom of your deck in a random order.)",
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 6,
            filter: {
              kind: "type",
              oneOf: ["ALLY"],
            },
          },
        },
      ],
    },
  },
};

export default rondoOfTheWind;
