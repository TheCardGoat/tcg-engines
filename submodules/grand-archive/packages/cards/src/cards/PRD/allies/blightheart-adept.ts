import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blightheartAdept: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "71k4YomVjX",
  slug: "blightheart-adept",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "71k4YomVjX:face:default",
      catalogId: "71k4YomVjX",
      name: "Blightheart Adept",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: If you control an Elysian object, draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "71k4YomVjX-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you control an Elysian object, draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["ELYSIAN"],
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default blightheartAdept;
