import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trainingSession: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "G42RDwb3Ko",
  slug: "training-session",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "G42RDwb3Ko:face:default",
      catalogId: "G42RDwb3Ko",
      name: "Training Session",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a buff counter on target ally you control. (Allies get +1 power and +1 life for each buff counter on them.)",
      abilities: [
        {
          id: "G42RDwb3Ko-a1",
          kind: "card-resolution",
          text: "Put a buff counter on target ally you control. (Allies get +1 power and +1 life for each buff counter on them.)",
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

export default trainingSession;
