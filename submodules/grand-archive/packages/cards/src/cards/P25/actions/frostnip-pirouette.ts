import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frostnipPirouette: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x79cuuw5vo",
  slug: "frostnip-pirouette",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x79cuuw5vo:face:default",
      catalogId: "x79cuuw5vo",
      name: "Frostnip Pirouette",
      cost: {
        kind: "reserve",
        amount: 4,
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
        "[Diao Chan Bonus] This card costs 2 less to activate.\n\nChoose any amount of non-champion objects and put a wither counter on each of them. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
      abilities: [
        {
          id: "x79cuuw5vo-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diao Chan Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "x79cuuw5vo-a2",
          kind: "card-resolution",
          text: "Choose any amount of non-champion objects and put a wither counter on each of them. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-objects",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "each-player",
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "chosen-objects",
              },
              counter: "wither",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default frostnipPirouette;
