import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tombSweep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uLuofHw9os",
  slug: "tomb-sweep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uLuofHw9os:face:default",
      catalogId: "uLuofHw9os",
      name: "Tomb Sweep",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 1+] This card costs 1 less to activate. (Apply this effect only if your champion is level 1 or higher.)\n\nBanish target card in a graveyard.",
      abilities: [
        {
          id: "uLuofHw9os-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] This card costs 1 less to activate. (Apply this effect only if your champion is level 1 or higher.)",
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
                  right: 1,
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
          id: "uLuofHw9os-a2",
          kind: "card-resolution",
          text: "Banish target card in a graveyard.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "banish-object",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
          },
        },
      ],
    },
  },
};

export default tombSweep;
