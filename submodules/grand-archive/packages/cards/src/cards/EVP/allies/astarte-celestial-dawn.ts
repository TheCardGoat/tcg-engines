import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const astarteCelestialDawn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f0ht2tsn0y",
  slug: "astarte-celestial-dawn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f0ht2tsn0y:face:default",
      catalogId: "f0ht2tsn0y",
      name: "Astarte, Celestial Dawn",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 2,
        life: 4,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nIf an object would enter the field under an opponent's control from anywhere except from the effects stack, banish it face down instead. ",
      abilities: [
        {
          id: "f0ht2tsn0y-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        },
        {
          id: "f0ht2tsn0y-a2",
          kind: "static",
          staticKind: "effects",
          text: "If an object would enter the field under an opponent's control from anywhere except from the effects stack, banish it face down instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "opponent",
                },
                fromNot: ["effects-stack"],
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "event-subject",
                  },
                  faceDown: true,
                },
              },
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

export default astarteCelestialDawn;
