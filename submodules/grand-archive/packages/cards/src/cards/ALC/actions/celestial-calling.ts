import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const celestialCalling: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "izm6h38lrj",
  slug: "celestial-calling",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "izm6h38lrj:face:default",
      catalogId: "izm6h38lrj",
      name: "Celestial Calling",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nReveal cards from the top of your deck until you reveal an astra element Spell card. Banish that card and put the rest on the bottom of your deck in a random order. At the beginning of your next recollection phase, you may activate the banished card without paying its reserve cost.",
      abilities: [
        {
          id: "izm6h38lrj-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "izm6h38lrj-a2",
          kind: "card-resolution",
          text: "Reveal cards from the top of your deck until you reveal an astra element Spell card. Banish that card and put the rest on the bottom of your deck in a random order. At the beginning of your next recollection phase, you may activate the banished card without paying its reserve cost.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal-until",
                player: "controller",
                zone: "main-deck",
                stopWhen: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["ASTRA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
                },
                bindMatchAs: "called-spell",
                bindRemainderAs: "revealed-cards",
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "called-spell",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-cards",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    order: {
                      kind: "random",
                    },
                  },
                },
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "recollection",
                    actor: "controller",
                  },
                },
                starts: {
                  kind: "next-turn",
                  whose: "controller",
                },
                limit: 1,
                expires: {
                  kind: "until-end-of-next-phase",
                  phase: "recollection",
                  whose: "controller",
                },
                effect: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "activate-card",
                    subject: {
                      kind: "bound",
                      binding: "called-spell",
                    },
                    payCosts: false,
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

export default celestialCalling;
