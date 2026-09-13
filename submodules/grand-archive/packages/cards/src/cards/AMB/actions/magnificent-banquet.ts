import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const magnificentBanquet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TQoTD8eGQH",
  slug: "magnificent-banquet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TQoTD8eGQH:face:default",
      catalogId: "TQoTD8eGQH",
      name: "Magnificent Banquet",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Recover 5. Then put Magnificent Banquet into its owner's material deck preserved. (If you would materialize a card, you may instead return a preserved card to your hand.)\n\nAt the beginning of your recollection phase, if this card is in your material deck preserved, recover 1.",
      abilities: [
        {
          id: "TQoTD8eGQH-a1",
          kind: "card-resolution",
          text: "Recover 5. Then put Magnificent Banquet into its owner's material deck preserved. (If you would materialize a card, you may instead return a preserved card to your hand.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 5,
              },
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "material-deck",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "source",
                },
                state: "preserved",
                value: true,
              },
            ],
          },
        },
        {
          id: "TQoTD8eGQH-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, if this card is in your material deck preserved, recover 1.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          functionalZones: ["material-deck"],
          effect: {
            kind: "conditional",
            condition: {
              kind: "source-zone",
              zone: "material-deck",
              state: "preserved",
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default magnificentBanquet;
