import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const curseAmplification: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x9z2k2a5ig",
  slug: "curse-amplification",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x9z2k2a5ig:face:default",
      catalogId: "x9z2k2a5ig",
      name: "Curse Amplification",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Diana Bonus] This card costs 3 less to activate.\n\nIf your champion has twenty or more damage counters on them, recover 4.\n\nFor the rest of the game, Curse cards in lineages have “Inherited Effect: At the beginning of your recollection phase, deal 1 unpreventable damage to this object.”",
      abilities: [
        {
          id: "x9z2k2a5ig-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Diana Bonus] This card costs 3 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "x9z2k2a5ig-a2",
          kind: "card-resolution",
          text: "If your champion has twenty or more damage counters on them, recover 4.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                operator: "gte",
                right: 20,
              },
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: 4,
            },
          },
        },
        {
          id: "x9z2k2a5ig-a3",
          kind: "card-resolution",
          text: "For the rest of the game, Curse cards in lineages have “Inherited Effect: At the beginning of your recollection phase, deal 1 unpreventable damage to this object.”",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["inner-lineage"],
                player: "each-player",
                filter: {
                  kind: "subtype",
                  oneOf: ["CURSE"],
                },
              },
            },
            affectedSet: "dynamic",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-2mhfca-a1",
                kind: "triggered",
                text: "Inherited Effect: At the beginning of your recollection phase, deal 1 unpreventable damage to this object.",
                executionSource: "lineage-host",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "recollection",
                    actor: "controller",
                  },
                },
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "ability-bearer",
                  },
                  recipient: {
                    kind: "ability-bearer",
                  },
                  amount: 1,
                  preventable: false,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default curseAmplification;
