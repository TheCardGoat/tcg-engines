import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wandOfFrost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n0wpbhigka",
  slug: "wand-of-frost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n0wpbhigka:face:default",
      catalogId: "n0wpbhigka",
      name: "Wand of Frost",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "WAND"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Draw a card.\n\nBanish Wand of Frost: Target unit's attacks get -3 POWER until end of turn.",
      abilities: [
        {
          id: "n0wpbhigka-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card.",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "n0wpbhigka-a2",
          kind: "activated",
          text: "Banish Wand of Frost: Target unit's attacks get -3 POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "bound-object",
                  binding: "target-1",
                },
              },
            },
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "subtract",
                amount: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default wandOfFrost;
