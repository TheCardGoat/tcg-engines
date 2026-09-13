import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cureTheFlesh: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5fgehl270c",
  slug: "cure-the-flesh",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5fgehl270c:face:default",
      catalogId: "5fgehl270c",
      name: "Cure the Flesh",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "Remove all temporary damage from target ally. Draw a card into your memory.",
      abilities: [
        {
          id: "5fgehl270c-a1",
          kind: "card-resolution",
          text: "Remove all temporary damage from target ally. Draw a card into your memory.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "damage",
                counterScope: "temporary",
                amount: {
                  kind: "all",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default cureTheFlesh;
