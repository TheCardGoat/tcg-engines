import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seiryuusCommand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v9d2242357",
  slug: "seiryuus-command",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v9d2242357:face:default",
      catalogId: "v9d2242357",
      name: "Seiryuu's Command",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "As long as you control an arcane element Shenju ally, ignore this card's elemental requirements as you activate it. \n\nUntil end of turn, whenever target Beast attacks, trigger all of its on attack abilities twice.",
      abilities: [
        {
          id: "v9d2242357-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control an arcane element Shenju ally, ignore this card's elemental requirements as you activate it.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "ignore-element-requirement",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "element",
                        oneOf: ["ARCANE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHENJU"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "v9d2242357-a2",
          kind: "card-resolution",
          text: "Until end of turn, whenever target Beast attacks, trigger all of its on attack abilities twice.",
          targets: [
            {
              id: "target-beast",
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
                  kind: "subtype",
                  oneOf: ["BEAST"],
                },
              },
            },
          ],
          effect: {
            kind: "trigger-multiplier",
            triggerName: "on-attack",
            event: {
              name: "attack-declared",
              subject: {
                kind: "bound-object",
                binding: "target-beast",
              },
            },
            operation: {
              kind: "set-total",
              totalTimes: 2,
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

export default seiryuusCommand;
