import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const memoryInvocation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "io7maIjC4u",
  slug: "memory-invocation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "io7maIjC4u:face:default",
      catalogId: "io7maIjC4u",
      name: "Memory Invocation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, banish a card with floating memory from your graveyard.\n\nDraw two cards.",
      abilities: [
        {
          id: "io7maIjC4u-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish a card with floating memory from your graveyard.",
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
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "io7maIjC4u-a2",
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

export default memoryInvocation;
