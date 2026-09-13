import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flawlessSpiritOfMordred: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cXEI5vo6iG",
  slug: "flawless-spirit-of-mordred",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cXEI5vo6iG:face:default",
      catalogId: "cXEI5vo6iG",
      name: "Flawless Spirit of Mordred",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["WATER"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText:
        'Divine Relic (You can only have one card with this keyword in your material deck.)\n\nFlawless Spirit of Mordred can only level up into a "Mordred" champion.\n\nOn Enter: Draw seven cards, then glimpse 4.\n',
      abilities: [
        {
          id: "cXEI5vo6iG-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "cXEI5vo6iG-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Flawless Spirit of Mordred can only level up into a "Mordred" champion.',
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "level-up",
              subject: {
                kind: "source",
              },
              destinationFilter: {
                kind: "champion-name",
                value: "Mordred",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "cXEI5vo6iG-a3",
          kind: "triggered",
          text: "On Enter: Draw seven cards, then glimpse 4.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 7,
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 4,
              },
            ],
          },
        },
      ],
    },
  },
};

export default flawlessSpiritOfMordred;
