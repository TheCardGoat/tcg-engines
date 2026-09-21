import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const willToSave: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qUd2uwAPvh",
  slug: "will-to-save",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qUd2uwAPvh:face:default",
      catalogId: "qUd2uwAPvh",
      name: "Will to Save",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "You may rest your champion. If you do, put a preparation counter on them.\n\nFloating Memory",
      abilities: [
        {
          id: "qUd2uwAPvh-a1",
          kind: "card-resolution",
          text: "You may rest your champion. If you do, put a preparation counter on them.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "rest",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "preparation",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
        {
          id: "qUd2uwAPvh-a2",
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

export default willToSave;
