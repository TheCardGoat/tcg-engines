import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const winblessForecaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dm44nt1lyk",
  slug: "winbless-forecaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dm44nt1lyk:face:default",
      catalogId: "dm44nt1lyk",
      name: "Winbless Forecaster",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "If one or more enlighten counters would be put on your champion, that many plus one enlighten counters are put on your champion instead.",
      abilities: [
        {
          id: "dm44nt1lyk-a1",
          kind: "static",
          staticKind: "effects",
          text: "If one or more enlighten counters would be put on your champion, that many plus one enlighten counters are put on your champion instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "counter-added",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                counter: "enlighten",
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default winblessForecaster;
