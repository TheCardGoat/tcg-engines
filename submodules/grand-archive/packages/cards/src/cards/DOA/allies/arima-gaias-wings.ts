import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arimaGaiasWings: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "075L8pLihO",
  slug: "arima-gaias-wings",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "075L8pLihO:face:default",
      catalogId: "075L8pLihO",
      name: "Arima, Gaia's Wings",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "PHOENIX"],
      },
      elements: ["TERA"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)\n\nAt the beginning of your recollection phase, put three buff counters on Arima.\n\nOn Death: Put Arima into its owner's memory.",
      abilities: [
        {
          id: "075L8pLihO-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5 (This ally won't obey you unless your champion is level 5 or higher.)",
          keyword: {
            name: "pride",
            value: 5,
          },
        },
        {
          id: "075L8pLihO-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put three buff counters on Arima.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 3,
          },
        },
        {
          id: "075L8pLihO-a3",
          kind: "triggered",
          text: "On Death: Put Arima into its owner's memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default arimaGaiasWings;
