import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prismaticSanctuary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9w0ejcyuvu",
  slug: "prismatic-sanctuary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9w0ejcyuvu:face:default",
      catalogId: "9w0ejcyuvu",
      name: "Prismatic Sanctuary",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Upkeep — At the beginning of your recollection phase, reveal a card at random from your memory. If that card is not fire, water, nor wind element, sacrifice Prismatic Sanctuary.\n\nFire, water, and wind elements are enabled for you.",
      abilities: [
        {
          id: "9w0ejcyuvu-a1",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, reveal a card at random from your memory. If that card is not fire, water, nor wind element, sacrifice Prismatic Sanctuary.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "random-memory-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  method: "random",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "not",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "bound",
                      binding: "random-memory-card",
                    },
                    filter: {
                      kind: "element",
                      oneOf: ["FIRE", "WATER", "WIND"],
                    },
                  },
                },
                then: {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
        {
          id: "9w0ejcyuvu-a2",
          kind: "static",
          staticKind: "effects",
          text: "Fire, water, and wind elements are enabled for you.",
          effects: [
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "FIRE",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "WATER",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "continuous-player-state",
              players: "controller",
              state: {
                named: "enabled-element",
                value: "WIND",
              },
              value: true,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default prismaticSanctuary;
