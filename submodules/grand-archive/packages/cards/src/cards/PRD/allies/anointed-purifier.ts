import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const anointedPurifier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mt1I9kfowQ",
  slug: "anointed-purifier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mt1I9kfowQ:face:default",
      catalogId: "mt1I9kfowQ",
      name: "Anointed Purifier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Anointed Purifier enters the field with two additional buff counters on it.\n\nREST, Remove two buff counters from Anointed Purifier:  Destroy target phantasia.",
      abilities: [
        {
          id: "mt1I9kfowQ-a1",
          kind: "static",
          staticKind: "effects",
          text: "Anointed Purifier enters the field with two additional buff counters on it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "buff",
                    amount: 2,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "mt1I9kfowQ-a2",
          kind: "activated",
          text: "REST, Remove two buff counters from Anointed Purifier:  Destroy target phantasia.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                amount: 2,
              },
            ],
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
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default anointedPurifier;
