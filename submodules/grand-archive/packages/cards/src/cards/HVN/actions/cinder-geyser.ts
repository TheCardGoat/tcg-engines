import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cinderGeyser: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "stiyh3pmk3",
  slug: "cinder-geyser",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "stiyh3pmk3:face:default",
      catalogId: "stiyh3pmk3",
      name: "Cinder Geyser",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] As long as an opponent has four or more cards in their memory, this card costs 2 less to activate.\n\nDeal 4 damage to target unit.",
      abilities: [
        {
          id: "stiyh3pmk3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent has four or more cards in their memory, this card costs 2 less to activate.",
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
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "memory",
                operator: "gte",
                value: 4,
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
          id: "stiyh3pmk3-a2",
          kind: "card-resolution",
          text: "Deal 4 damage to target unit.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 4,
          },
        },
      ],
    },
  },
};

export default cinderGeyser;
