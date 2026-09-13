import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nippingKicker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UBB1DWYDeS",
  slug: "nipping-kicker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UBB1DWYDeS:face:default",
      catalogId: "UBB1DWYDeS",
      name: "Nipping Kicker",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SUITED", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time target unit would take damage from a Suited Spell source you control this turn, it takes that much damage plus 3 instead.\n\nFloating Memory",
      abilities: [
        {
          id: "UBB1DWYDeS-a1",
          kind: "card-resolution",
          text: "The next time target unit would take damage from a Suited Spell source you control this turn, it takes that much damage plus 3 instead.",
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "add",
              amount: 3,
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "UBB1DWYDeS-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default nippingKicker;
