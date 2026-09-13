import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfSnow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uhuy4xippo",
  slug: "fractal-of-snow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uhuy4xippo:face:default",
      catalogId: "uhuy4xippo",
      name: "Fractal of Snow",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)\n\n[Class Bonus] Sacrifice Fractal of Snow: The next time one or more allies would enter the field this turn, they enter the field rested instead.",
      abilities: [
        {
          id: "uhuy4xippo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "uhuy4xippo-a2",
          kind: "activated",
          text: "[Class Bonus] Sacrifice Fractal of Snow: The next time one or more allies would enter the field this turn, they enter the field rested instead.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
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
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
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
      ],
    },
  },
};

export default fractalOfSnow;
