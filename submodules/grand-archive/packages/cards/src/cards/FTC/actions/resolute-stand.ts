import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const resoluteStand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o6gb0op3nq",
  slug: "resolute-stand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o6gb0op3nq:face:default",
      catalogId: "o6gb0op3nq",
      name: "Resolute Stand",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 2+] You may activate this card without paying its reserve cost. If you do, skip your next draw phase.\n\nIf target unit would be dealt combat damage this turn, prevent 3 of that damage.",
      abilities: [
        {
          id: "o6gb0op3nq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] You may activate this card without paying its reserve cost. If you do, skip your next draw phase.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "pay-reserve",
                amount: 0,
              },
              activationResult: {
                afterResolution: {
                  kind: "skip-next-phase",
                  player: "controller",
                  phase: "draw",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "o6gb0op3nq-a2",
          kind: "card-resolution",
          text: "If target unit would be dealt combat damage this turn, prevent 3 of that damage.",
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
              combatDamage: true,
            },
            operation: {
              kind: "prevent",
              amount: 3,
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

export default resoluteStand;
