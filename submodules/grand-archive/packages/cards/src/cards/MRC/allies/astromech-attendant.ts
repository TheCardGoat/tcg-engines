import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const astromechAttendant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mloejozihs",
  slug: "astromech-attendant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mloejozihs:face:default",
      catalogId: "mloejozihs",
      name: "Astromech Attendant",
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
      elements: ["ASTRA"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Gather three times.\n\nWhenever you brew a Potion, draw a card into your memory.",
      abilities: [
        {
          id: "mloejozihs-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Gather three times.",
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
            kind: "repeat",
            count: 3,
            effect: {
              kind: "keyword-action",
              action: "gather",
            },
          },
        },
        {
          id: "mloejozihs-a2",
          kind: "triggered",
          text: "Whenever you brew a Potion, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "brew",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POTION"],
                },
              },
            },
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

export default astromechAttendant;
