import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const freezingSteel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x7mdk0xhi5",
  slug: "freezing-steel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x7mdk0xhi5:face:default",
      catalogId: "x7mdk0xhi5",
      name: "Freezing Steel",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time one or more items would enter the field this turn, those items enter the field rested instead. \n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "x7mdk0xhi5-a1",
          kind: "card-resolution",
          text: "The next time one or more items would enter the field this turn, those items enter the field rested instead.",
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ITEM"],
                },
              },
            },
            operation: {
              kind: "modify-object-state",
              state: "rested",
              value: true,
            },
            duration: {
              kind: "for-next-event",
              event: "object-entered-field",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "x7mdk0xhi5-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default freezingSteel;
