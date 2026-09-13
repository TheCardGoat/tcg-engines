import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const drownedExorcist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qe1pkerbi3",
  slug: "drowned-exorcist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qe1pkerbi3:face:default",
      catalogId: "qe1pkerbi3",
      name: "Drowned Exorcist",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Level 2+] On Enter: Each player banishes all non-water element cards from their graveyard. \nDeluge 8 — On Death: If you have eight or more water element cards in your graveyard, draw two cards.",
      abilities: [
        {
          id: "qe1pkerbi3-a1",
          kind: "triggered",
          text: "[Level 2+] On Enter: Each player banishes all non-water element cards from their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "banish",
            player: "each-player",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "each-player",
              count: {
                kind: "all",
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "each-player",
                filter: {
                  kind: "not",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
          },
        },
        {
          id: "qe1pkerbi3-a2",
          kind: "triggered",
          text: "Deluge 8 — On Death: If you have eight or more water element cards in your graveyard, draw two cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
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
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                  },
                },
                operator: "gte",
                right: 8,
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 2,
            },
          },
          label: {
            name: "Deluge 8",
          },
        },
      ],
    },
  },
};

export default drownedExorcist;
