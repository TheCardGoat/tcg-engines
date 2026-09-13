import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const navigationCompass: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sw2ugmnmp5",
  slug: "navigation-compass",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sw2ugmnmp5:face:default",
      catalogId: "sw2ugmnmp5",
      name: "Navigation Compass",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize. (Apply this effect only if your champion's class matches this card's class.)\n\nREST, Discard a domain card: Draw a card into your memory.",
      abilities: [
        {
          id: "sw2ugmnmp5-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize. (Apply this effect only if your champion's class matches this card's class.)",
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
          id: "sw2ugmnmp5-a2",
          kind: "activated",
          text: "REST, Discard a domain card: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
              },
            ],
          },
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

export default navigationCompass;
