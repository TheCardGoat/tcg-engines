import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windCutter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TgYTZg6TaG",
  slug: "wind-cutter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TgYTZg6TaG:face:default",
      catalogId: "TgYTZg6TaG",
      name: "Wind Cutter",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["RANGER", "WARRIOR"],
        subtypes: ["RANGER", "WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] Wind Cutter gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)\n\nOn Hit: Reveal a card at random from your memory. If that card is wind element, put Wind Cutter into its owner's memory.",
      abilities: [
        {
          id: "TgYTZg6TaG-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Wind Cutter gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
        },
        {
          id: "TgYTZg6TaG-a2",
          kind: "triggered",
          text: "On Hit: Reveal a card at random from your memory. If that card is wind element, put Wind Cutter into its owner's memory.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
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
                  method: "random",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "reveal-selection",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "memory",
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

export default windCutter;
