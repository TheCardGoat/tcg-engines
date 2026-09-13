import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cremationRitual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Pr48kXnasw",
  slug: "cremation-ritual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Pr48kXnasw:face:default",
      catalogId: "Pr48kXnasw",
      name: "Cremation Ritual",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally.\n\nDraw two cards.",
      abilities: [
        {
          id: "Pr48kXnasw-a1",
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
          id: "Pr48kXnasw-a2",
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

export default cremationRitual;
