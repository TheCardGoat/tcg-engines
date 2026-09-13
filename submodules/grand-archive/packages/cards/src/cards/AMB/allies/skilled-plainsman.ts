import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const skilledPlainsman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "55u41ilks4",
  slug: "skilled-plainsman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "55u41ilks4:face:default",
      catalogId: "55u41ilks4",
      name: "Skilled Plainsman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Equestrian — On Enter: If you control a Horse ally, put a buff counter on Skilled Plainsman. (Allies get +1 POWER and +1 LIFE for each buff counter on them. Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "55u41ilks4-a1",
          kind: "triggered",
          text: "[Class Bonus] Equestrian — On Enter: If you control a Horse ally, put a buff counter on Skilled Plainsman. (Allies get +1 POWER and +1 LIFE for each buff counter on them. Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 1,
            },
          },
          label: {
            name: "Equestrian",
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
      ],
    },
  },
};

export default skilledPlainsman;
