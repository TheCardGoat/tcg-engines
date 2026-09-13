import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fountSeraphim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k4pjo6lVMO",
  slug: "fount-seraphim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k4pjo6lVMO:face:default",
      catalogId: "k4pjo6lVMO",
      name: "Fount Seraphim",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ANGEL"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)\n\nTaunt\n\nOn Enter: If Fount Seraphim is imbued, until the beginning of your next turn, allies your opponents control enter the field rested.",
      abilities: [
        {
          id: "k4pjo6lVMO-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "advanced",
          },
        },
        {
          id: "k4pjo6lVMO-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "k4pjo6lVMO-a3",
          kind: "triggered",
          text: "On Enter: If Fount Seraphim is imbued, until the beginning of your next turn, allies your opponents control enter the field rested.",
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
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "opponent",
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
                kind: "until-start-of-turn",
                whose: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default fountSeraphim;
