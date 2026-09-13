import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritedFalconer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a5igwbsmks",
  slug: "spirited-falconer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a5igwbsmks:face:default",
      catalogId: "a5igwbsmks",
      name: "Spirited Falconer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Fast Activation\n\n[Class Bonus] On Enter: Put a buff counter on up to two target Animal and/or Beast allies.",
      abilities: [
        {
          id: "a5igwbsmks-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation",
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
          id: "a5igwbsmks-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a buff counter on up to two target Animal and/or Beast allies.",
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
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
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
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default spiritedFalconer;
