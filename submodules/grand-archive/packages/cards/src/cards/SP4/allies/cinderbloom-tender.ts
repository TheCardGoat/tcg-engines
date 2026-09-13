import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cinderbloomTender: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lgdlx7mdk0",
  slug: "cinderbloom-tender",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lgdlx7mdk0:face:default",
      catalogId: "lgdlx7mdk0",
      name: "Cinderbloom Tender",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Whenever you gather, deal 1 damage to each champion. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "lgdlx7mdk0-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever you gather, deal 1 damage to each champion. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "gather",
            },
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
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default cinderbloomTender;
