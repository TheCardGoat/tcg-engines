import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const solomonMasterOfElements: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q0P2TmYGXs",
  slug: "solomon-master-of-elements",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q0P2TmYGXs:face:default",
      catalogId: "q0P2TmYGXs",
      name: "Solomon, Master of Elements",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "On Enter: You may discard all cards in your hand and memory. If you do, generate an Arcane Sight, Astra Sight, Crux Sight, Exia Sight, Luxem Sight, Neos Sight, Tera Sight, and Umbra Sight card and put them into your memory. For the rest the game, ignore the elemental requirements of cards you activate with the same name as one of the generated cards.",
      abilities: [
        {
          id: "q0P2TmYGXs-a1",
          kind: "triggered",
          text: "On Enter: You may discard all cards in your hand and memory. If you do, generate an Arcane Sight, Astra Sight, Crux Sight, Exia Sight, Luxem Sight, Neos Sight, Tera Sight, and Umbra Sight card and put them into your memory. For the rest the game, ignore the elemental requirements of cards you activate with the same name as one of the generated cards.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-hand-and-memory",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "all",
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["hand", "memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
                  kind: "generate",
                  card: "Arcane Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Astra Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Crux Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Exia Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Luxem Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Neos Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Tera Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "generate",
                  card: "Umbra Sight",
                  player: "controller",
                  destination: {
                    zone: "memory",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "ignore-element-requirement",
                  subject: {
                    kind: "player",
                    player: "controller",
                  },
                  filter: {
                    kind: "any",
                    filters: [
                      {
                        kind: "name",
                        value: "Arcane Sight",
                      },
                      {
                        kind: "name",
                        value: "Astra Sight",
                      },
                      {
                        kind: "name",
                        value: "Crux Sight",
                      },
                      {
                        kind: "name",
                        value: "Exia Sight",
                      },
                      {
                        kind: "name",
                        value: "Luxem Sight",
                      },
                      {
                        kind: "name",
                        value: "Neos Sight",
                      },
                      {
                        kind: "name",
                        value: "Tera Sight",
                      },
                      {
                        kind: "name",
                        value: "Umbra Sight",
                      },
                    ],
                  },
                  duration: {
                    kind: "permanent",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default solomonMasterOfElements;
