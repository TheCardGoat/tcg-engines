import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reprogram: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o6eanbrfnr",
  slug: "reprogram",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o6eanbrfnr:face:default",
      catalogId: "o6eanbrfnr",
      name: "Reprogram",
      cost: {
        kind: "reserve",
        amount: 2,
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
      rulesText:
        "Up to one target ally gets -1 POWER until end of turn. If that ally is an Automaton, put two debuff counters on it instead. (Allies get -1 power and -1 life for each debuff counter on them.)\n\nFloating Memory",
      abilities: [
        {
          id: "o6eanbrfnr-a1",
          kind: "card-resolution",
          text: "Up to one target ally gets -1 POWER until end of turn. If that ally is an Automaton, put two debuff counters on it instead. (Allies get -1 power and -1 life for each debuff counter on them.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              filter: {
                kind: "subtype",
                oneOf: ["AUTOMATON"],
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "debuff",
              amount: 2,
            },
            else: {
              kind: "continuous",
              subjects: {
                kind: "bound",
                binding: "target-1",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-turn",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "subtract",
                amount: 1,
              },
            },
          },
        },
        {
          id: "o6eanbrfnr-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default reprogram;
