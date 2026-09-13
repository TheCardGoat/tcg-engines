import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reconnaissanceField: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2rz308kuz0",
  slug: "reconnaissance-field",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2rz308kuz0:face:default",
      catalogId: "2rz308kuz0",
      name: "Reconnaissance Field",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Look at target opponent's hand and memory. \n\n[Class Bonus] REST: Target unit gains ranged 1 and true sight until end of turn. (Units with true sight can attack units with stealth. Multiple instances of ranged stack.) ",
      abilities: [
        {
          id: "2rz308kuz0-a1",
          kind: "triggered",
          text: "On Enter: Look at target opponent's hand and memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
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
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "look-at",
            player: "controller",
            selection: {
              id: "inspected-cards",
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
                player: {
                  binding: "target-opponent",
                },
              },
            },
          },
        },
        {
          id: "2rz308kuz0-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Target unit gains ranged 1 and true sight until end of turn. (Units with true sight can attack units with stealth. Multiple instances of ranged stack.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
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
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "ranged",
                    value: 1,
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "true-sight",
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

export default reconnaissanceField;
