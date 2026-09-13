import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const buddyRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VMQsdBX2rx",
  slug: "buddy-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VMQsdBX2rx:face:default",
      catalogId: "VMQsdBX2rx",
      name: "Buddy Raccoon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nOn Enter: You may return another target Raccoon ally you control to its owner's hand.",
      abilities: [
        {
          id: "VMQsdBX2rx-a1",
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
          id: "VMQsdBX2rx-a2",
          kind: "triggered",
          text: "On Enter: You may return another target Raccoon ally you control to its owner's hand.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                    {
                      kind: "subtype",
                      oneOf: ["RACCOON"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              destination: {
                zone: "hand",
              },
            },
          },
        },
      ],
    },
  },
};

export default buddyRaccoon;
