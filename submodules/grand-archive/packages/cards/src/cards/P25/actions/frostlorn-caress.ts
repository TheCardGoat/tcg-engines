import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frostlornCaress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4tqbok1g9w",
  slug: "frostlorn-caress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4tqbok1g9w:face:default",
      catalogId: "4tqbok1g9w",
      name: "Frostlorn Caress",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Diao Chan Bonus] This card costs 3 less to activate.\n\nPut four wither counters on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
      abilities: [
        {
          id: "4tqbok1g9w-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] This card costs 3 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4tqbok1g9w-a2",
          kind: "card-resolution",
          text: "Put four wither counters on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
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
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
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
            counter: "wither",
            amount: 4,
          },
        },
      ],
    },
  },
};

export default frostlornCaress;
