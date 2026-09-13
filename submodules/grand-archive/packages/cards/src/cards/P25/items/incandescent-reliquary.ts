import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incandescentReliquary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wsycqp2l90",
  slug: "incandescent-reliquary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wsycqp2l90:face:default",
      catalogId: "wsycqp2l90",
      name: "Incandescent Reliquary",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "ARTIFACT"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nAt the beginning of your recollection phase, if you are the player with the least influence, draw a card. (A player's influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "wsycqp2l90-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "wsycqp2l90-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, if you are the player with the least influence, draw a card. (A player's influence is equal to the total amount of cards in their hand and memory.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-property-extreme",
              player: "controller",
              property: "influence",
              extreme: "minimum",
              ties: "qualify",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default incandescentReliquary;
