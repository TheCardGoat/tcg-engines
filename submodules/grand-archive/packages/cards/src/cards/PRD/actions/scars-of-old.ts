import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scarsOfOld: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lD0sK81PZT",
  slug: "scars-of-old",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lD0sK81PZT:face:default",
      catalogId: "lD0sK81PZT",
      name: "Scars of Old",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card, then discard a card.\n\n[Class Bonus] Put a buff counter on each damaged ally you control.",
      abilities: [
        {
          id: "lD0sK81PZT-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
        {
          id: "lD0sK81PZT-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put a buff counter on each damaged ally you control.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "damaged",
                    },
                  ],
                },
              },
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default scarsOfOld;
