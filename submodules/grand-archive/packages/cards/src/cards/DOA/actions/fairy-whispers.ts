import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fairyWhispers: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n8wyfG9hbY",
  slug: "fairy-whispers",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n8wyfG9hbY:face:default",
      catalogId: "n8wyfG9hbY",
      name: "Fairy Whispers",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)\n\nReveal the top card of your deck. If that card is wind element, put it into your hand.",
      abilities: [
        {
          id: "n8wyfG9hbY-a1",
          kind: "card-resolution",
          text: "Glimpse 3. (To glimpse, look at that many cards from the top of your deck. Put those cards back on the top or on the bottom of your deck in any order.)",
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 3,
          },
        },
        {
          id: "n8wyfG9hbY-a2",
          kind: "card-resolution",
          text: "Reveal the top card of your deck. If that card is wind element, put it into your hand.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  destination: {
                    zone: "hand",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default fairyWhispers;
