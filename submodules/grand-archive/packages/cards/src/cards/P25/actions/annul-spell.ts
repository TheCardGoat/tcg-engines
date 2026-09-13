import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const annulSpell: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u817uqlk1j",
  slug: "annul-spell",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u817uqlk1j:face:default",
      catalogId: "u817uqlk1j",
      name: "Annul Spell",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion's level is 2 or higher.)\n\nNegate target Spell card activation unless its controller pays (3).",
      abilities: [
        {
          id: "u817uqlk1j-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion's level is 2 or higher.)",
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
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "u817uqlk1j-a2",
          kind: "card-resolution",
          text: "Negate target Spell card activation unless its controller pays (3).",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
                sourceFilter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
          ],
          effect: {
            kind: "unless-paid",
            player: {
              controllerOf: "target-stack-item",
            },
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
            otherwise: {
              kind: "negate",
              subject: {
                kind: "bound",
                binding: "target-stack-item",
              },
              bindResultAs: "negated-stack-item",
            },
          },
        },
      ],
    },
  },
};

export default annulSpell;
