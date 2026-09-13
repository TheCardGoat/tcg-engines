import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beltedTune: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ko5PJRsy25",
  slug: "belted-tune",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ko5PJRsy25:face:default",
      catalogId: "ko5PJRsy25",
      name: "Belted Tune",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL", "MELODY"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a buff counter on target ally. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "ko5PJRsy25-a1",
          kind: "card-resolution",
          text: "Put a buff counter on target ally. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
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

export default beltedTune;
