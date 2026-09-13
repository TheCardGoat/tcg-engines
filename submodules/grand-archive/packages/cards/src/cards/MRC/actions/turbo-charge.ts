import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const turboCharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cnqsm3n9yv",
  slug: "turbo-charge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cnqsm3n9yv:face:default",
      catalogId: "cnqsm3n9yv",
      name: "Turbo Charge",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a Powercell.\n\nDraw two cards.",
      abilities: [
        {
          id: "cnqsm3n9yv-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Powercell.",
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
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "cnqsm3n9yv-a2",
          kind: "card-resolution",
          text: "Draw two cards.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default turboCharge;
