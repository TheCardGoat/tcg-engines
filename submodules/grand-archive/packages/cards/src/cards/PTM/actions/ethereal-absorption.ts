import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const etherealAbsorption: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4zEOAaLdap",
  slug: "ethereal-absorption",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4zEOAaLdap:face:default",
      catalogId: "4zEOAaLdap",
      name: "Ethereal Absorption",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, return a regalia you control to its owner's material deck. \n\nDraw a card, then put two preparation counters on your champion.",
      abilities: [
        {
          id: "4zEOAaLdap-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, return a regalia you control to its owner's material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "field",
                to: "material-deck",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4zEOAaLdap-a2",
          kind: "card-resolution",
          text: "Draw a card, then put two preparation counters on your champion.",
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
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default etherealAbsorption;
