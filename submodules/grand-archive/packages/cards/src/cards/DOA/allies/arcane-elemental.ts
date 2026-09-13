import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arcaneElemental: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wFH1kBLrWh",
  slug: "arcane-elemental",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wFH1kBLrWh:face:default",
      catalogId: "wFH1kBLrWh",
      name: "Arcane Elemental",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELEMENTAL"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 7,
        life: 7,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each arcane element card in your banishment.\n\nPride 7 (This ally won't obey you unless your champion is level 7 or higher.)\n\nOn Attack: At the beginning of the next end phase, banish Arcane Elemental.",
      abilities: [
        {
          id: "wFH1kBLrWh-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each arcane element card in your banishment.",
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
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["ARCANE"],
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
          id: "wFH1kBLrWh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 7 (This ally won't obey you unless your champion is level 7 or higher.)",
          keyword: {
            name: "pride",
            value: 7,
          },
        },
        {
          id: "wFH1kBLrWh-a3",
          kind: "triggered",
          text: "On Attack: At the beginning of the next end phase, banish Arcane Elemental.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "phase-begins",
                phase: "end",
              },
            },
            effect: {
              kind: "banish-object",
              subject: {
                kind: "source",
              },
            },
          },
        },
      ],
    },
  },
};

export default arcaneElemental;
