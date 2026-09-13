import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bolsterRanks: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n0esog2898",
  slug: "bolster-ranks",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n0esog2898:face:default",
      catalogId: "n0esog2898",
      name: "Bolster Ranks",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nChoose one—\n• Summon an Automaton Drone token with a buff counter on it. \n• Put a buff counter on each ally you control.",
      abilities: [
        {
          id: "n0esog2898-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "n0esog2898-a2",
          kind: "card-resolution",
          text: "Choose one—\n• Summon an Automaton Drone token with a buff counter on it.\n• Put a buff counter on each ally you control.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Summon an Automaton Drone token with a buff counter on it.",
                effect: {
                  kind: "summon",
                  object: "Automaton Drone",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                  entersWithCounters: [
                    {
                      counter: "buff",
                      amount: 1,
                    },
                  ],
                },
              },
              {
                id: "mode-2",
                text: "Put a buff counter on each ally you control",
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
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
      ],
    },
  },
};

export default bolsterRanks;
