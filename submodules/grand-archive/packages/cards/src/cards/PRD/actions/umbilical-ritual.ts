import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const umbilicalRitual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TfBuA9PUAO",
  slug: "umbilical-ritual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TfBuA9PUAO:face:default",
      catalogId: "TfBuA9PUAO",
      name: "Umbilical Ritual",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally. \n\nRecover 4 and empower 4.",
      abilities: [
        {
          id: "TfBuA9PUAO-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice an ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TfBuA9PUAO-a2",
          kind: "card-resolution",
          text: "Recover 4 and empower 4.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 4,
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: 4,
              },
            ],
          },
        },
      ],
    },
  },
};

export default umbilicalRitual;
