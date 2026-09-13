import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cryogenicRitual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FWinA77xF1",
  slug: "cryogenic-ritual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FWinA77xF1:face:default",
      catalogId: "FWinA77xF1",
      name: "Cryogenic Ritual",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally.\n\nSummon a Core Fractal token.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "FWinA77xF1-a1",
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
          id: "FWinA77xF1-a2",
          kind: "card-resolution",
          text: "Summon a Core Fractal token.",
          effect: {
            kind: "summon",
            object: "Core Fractal",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "FWinA77xF1-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default cryogenicRitual;
