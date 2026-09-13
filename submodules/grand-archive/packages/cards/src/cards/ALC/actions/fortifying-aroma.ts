import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fortifyingAroma: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "doo4sk9q9e",
  slug: "fortifying-aroma",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "doo4sk9q9e:face:default",
      catalogId: "doo4sk9q9e",
      name: "Fortifying Aroma",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 1 less to activate for each Herb you control.\n\nPut two buff counters on target ally. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "doo4sk9q9e-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate for each Herb you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["HERB"],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "doo4sk9q9e-a2",
          kind: "card-resolution",
          text: "Put two buff counters on target ally. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
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
            amount: 2,
          },
        },
      ],
    },
  },
};

export default fortifyingAroma;
