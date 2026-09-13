import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thinkDeep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xw9w6y7vtz",
  slug: "think-deep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xw9w6y7vtz:face:default",
      catalogId: "xw9w6y7vtz",
      name: "Think Deep",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 2 less to activate as long as you control a Fatestone or a Fatebound object. \n\nGlimpse 2, then put up to two cards from the top of your deck into your graveyard.",
      abilities: [
        {
          id: "xw9w6y7vtz-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate as long as you control a Fatestone or a Fatebound object.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["FATEBOUND"],
                  },
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "xw9w6y7vtz-a2",
          kind: "card-resolution",
          text: "Glimpse 2, then put up to two cards from the top of your deck into your graveyard.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "choose",
                selection: {
                  id: "top-cards-to-graveyard",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "top-cards-to-graveyard",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "graveyard",
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

export default thinkDeep;
