import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfProvocation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SyDMB8D78p",
  slug: "lesser-boon-of-provocation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SyDMB8D78p:face:default",
      catalogId: "SyDMB8D78p",
      name: "Lesser Boon of Provocation",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Level Locked 1 (Play this card only if your champion’s base level is 1 or higher.) \n\nBestow this boon only during an opponent's recollection phase.\n\nTarget ally the turn player controls must attack a unit another target opponent controls this turn if able.\n\n",
      abilities: [
        {
          id: "SyDMB8D78p-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 1 (Play this card only if your champion’s base level is 1 or higher.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
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
                    basis: "base",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "SyDMB8D78p-a2",
          kind: "static",
          staticKind: "effects",
          text: "Bestow this boon only during an opponent's recollection phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "bestow",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "SyDMB8D78p-a3",
          kind: "card-resolution",
          text: "Target ally the turn player controls must attack a unit another target opponent controls this turn if able.",
          targets: [
            {
              id: "required-attacker",
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
                relationship: "controlled-by",
                player: "turn-player",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            {
              id: "defending-opponent",
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
            kind: "rule-modification",
            mode: "require",
            action: "attack",
            subject: {
              kind: "bound",
              binding: "required-attacker",
            },
            against: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: {
                  binding: "defending-opponent",
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            requiredCount: {
              minimum: 1,
              per: "turn",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfProvocation;
