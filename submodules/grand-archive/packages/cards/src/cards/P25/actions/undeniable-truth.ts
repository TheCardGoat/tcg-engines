import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const undeniableTruth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UaUfw7yFTW",
  slug: "undeniable-truth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UaUfw7yFTW:face:default",
      catalogId: "UaUfw7yFTW",
      name: "Undeniable Truth",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally. \n\nDraw a card, then put a preparation counter on your champion.",
      abilities: [
        {
          id: "UaUfw7yFTW-a1",
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
          id: "UaUfw7yFTW-a2",
          kind: "card-resolution",
          text: "Draw a card, then put a preparation counter on your champion.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default undeniableTruth;
