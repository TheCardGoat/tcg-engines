import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const currentGroover: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3lMV08BClz",
  slug: "current-groover",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3lMV08BClz:face:default",
      catalogId: "3lMV08BClz",
      name: "Current Groover",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "RESONATOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Deluge 3 — As long as you have three or more water element cards in your graveyard, Current Groover gets +1POWER.\n\nWhenever you activate a Harmony or Melody card, target player puts the top three cards of their deck into their graveyard.",
      abilities: [
        {
          id: "3lMV08BClz-a1",
          kind: "static",
          staticKind: "effects",
          text: "Deluge 3 — As long as you have three or more water element cards in your graveyard, Current Groover gets +1POWER.",
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
                  right: 3,
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
                amount: 1,
              },
            },
          ],
          label: {
            name: "Deluge 3",
          },
        },
        {
          id: "3lMV08BClz-a2",
          kind: "triggered",
          text: "Whenever you activate a Harmony or Melody card, target player puts the top three cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
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
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default currentGroover;
