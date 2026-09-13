import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unmakeDuality: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uWLKGJz1GY",
  slug: "unmake-duality",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uWLKGJz1GY:face:default",
      catalogId: "uWLKGJz1GY",
      name: "Unmake Duality",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a regalia with divine relic.\n\nDraw two cards.",
      abilities: [
        {
          id: "uWLKGJz1GY-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a regalia with divine relic.",
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
          id: "uWLKGJz1GY-a2",
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

export default unmakeDuality;
