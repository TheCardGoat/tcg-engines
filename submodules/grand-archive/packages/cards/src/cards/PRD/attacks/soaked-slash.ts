import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const soakedSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6XDoCxQuoH",
  slug: "soaked-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6XDoCxQuoH:face:default",
      catalogId: "6XDoCxQuoH",
      name: "Soaked Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "Deluge 2 — As long as there are two or more water element cards in your graveyard, Soaked Slash gets +2POWER.\n\n[Class Bonus] On Attack: Target player puts the top two cards of their deck into their graveyard.",
      abilities: [
        {
          id: "6XDoCxQuoH-a1",
          kind: "static",
          staticKind: "effects",
          text: "Deluge 2 — As long as there are two or more water element cards in your graveyard, Soaked Slash gets +2POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
          ],
          label: {
            name: "Deluge 2",
          },
        },
        {
          id: "6XDoCxQuoH-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Target player puts the top two cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
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
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default soakedSlash;
