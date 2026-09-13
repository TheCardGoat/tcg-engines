import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lightweaversInfiniteShaping: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> =
  {
    canonicalId: "RBco1DfZ1B",
    slug: "lightweavers-infinite-shaping",
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: "RBco1DfZ1B:face:default",
        catalogId: "RBco1DfZ1B",
        name: "Lightweaver's Infinite Shaping",
        cost: {
          kind: "reserve",
          amount: 13,
        },
        typeLine: {
          supertypes: ["UNIQUE"],
          types: ["PHANTASIA"],
          classes: ["ASSASSIN"],
          subtypes: ["ASSASSIN", "ULTIMATE", "SPELL"],
        },
        elements: ["LUXEM"],
        stats: {},
        rulesText:
          "[Zander Bonus] Cards you reveal from your memory have all abilities of each other card revealed this way from your memory.\n\nOn Enter: Reveal all cards in your memory.\n\nAt the beginning of your end phase, sacrifice Lightweaver's Infinite Shaping.",
        abilities: [
          {
            id: "RBco1DfZ1B-a1",
            kind: "static",
            staticKind: "effects",
            text: "[Zander Bonus] Cards you reveal from your memory have all abilities of each other card revealed this way from your memory.",
            restrictions: [
              {
                kind: "static",
                name: "champion-bonus",
                condition: {
                  kind: "champion-lineage-is",
                  name: "Zander",
                },
              },
            ],
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "each",
                  collection: {
                    history: {
                      event: "card-revealed",
                      window: "this-resolution",
                      from: "memory",
                    },
                  },
                },
                affectedSet: "dynamic",
                duration: {
                  kind: "while-source-in-functional-zone",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "copy-abilities-from-collection",
                  collection: {
                    history: {
                      event: "card-revealed",
                      window: "this-resolution",
                      from: "memory",
                    },
                  },
                  excludingSelf: true,
                },
              },
            ],
          },
          {
            id: "RBco1DfZ1B-a2",
            kind: "triggered",
            text: "On Enter: Reveal all cards in your memory.",
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
              kind: "reveal",
              player: "controller",
              selection: {
                id: "revealed-memory",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "all",
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
            },
          },
          {
            id: "RBco1DfZ1B-a3",
            kind: "triggered",
            text: "At the beginning of your end phase, sacrifice Lightweaver's Infinite Shaping.",
            trigger: {
              kind: "event",
              event: {
                name: "phase-begins",
                phase: "end",
                actor: "controller",
              },
            },
            effect: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
        ],
      },
    },
  };

export default lightweaversInfiniteShaping;
