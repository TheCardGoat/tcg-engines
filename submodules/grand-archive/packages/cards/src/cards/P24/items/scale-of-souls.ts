import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scaleOfSouls: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0z2snsdwmx",
  slug: "scale-of-souls",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0z2snsdwmx:face:default",
      catalogId: "0z2snsdwmx",
      name: "Scale of Souls",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] Balance — At the beginning of your recollection phase, if the amount of cards in your hand and memory are equal, recover 2.\n\n(2), REST: Return a card from your memory to your hand.",
      abilities: [
        {
          id: "0z2snsdwmx-a1",
          kind: "triggered",
          text: "[Class Bonus] Balance — At the beginning of your recollection phase, if the amount of cards in your hand and memory are equal, recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "count",
                  collection: {
                    zones: ["hand"],
                    player: "controller",
                  },
                },
                operator: "eq",
                right: {
                  kind: "count",
                  collection: {
                    zones: ["memory"],
                    player: "controller",
                  },
                },
              },
            },
            then: {
              kind: "recover",
              player: "controller",
              amount: 2,
            },
          },
          label: {
            name: "Balance",
          },
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
        },
        {
          id: "0z2snsdwmx-a2",
          kind: "activated",
          text: "(2), REST: Return a card from your memory to your hand.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "choose",
            selection: {
              id: "returned-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "returned-card",
              },
              from: "memory",
              destination: {
                zone: "hand",
              },
            },
          },
        },
      ],
    },
  },
};

export default scaleOfSouls;
