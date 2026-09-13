import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const brusqueNeige: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "irt72g89zc",
  slug: "brusque-neige",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "irt72g89zc:face:default",
      catalogId: "irt72g89zc",
      name: "Brusque Neige",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may sacrifice an ally rather than pay this card's reserve cost.\n\nUntil end of turn, allies enter the field rested. \n\n[Ciel Bonus] [Level 2+] Banish Brusque Neige and put an omen counter on it.",
      abilities: [
        {
          id: "irt72g89zc-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may sacrifice an ally rather than pay this card's reserve cost.",
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
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "irt72g89zc-a2",
          kind: "card-resolution",
          text: "Until end of turn, allies enter the field rested.",
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            operation: {
              kind: "modify-object-state",
              state: "rested",
              value: true,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "irt72g89zc-a3",
          kind: "card-resolution",
          text: "[Ciel Bonus] [Level 2+] Banish Brusque Neige and put an omen counter on it.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
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
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "event-subject",
                },
                counter: "omen",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default brusqueNeige;
