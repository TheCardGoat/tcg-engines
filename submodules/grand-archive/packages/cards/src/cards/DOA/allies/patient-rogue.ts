import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const patientRogue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CvvgJR4fNa",
  slug: "patient-rogue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CvvgJR4fNa:face:default",
      catalogId: "CvvgJR4fNa",
      name: "Patient Rogue",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Patient Rogue has stealth as long as it's awake. (This unit can't be targeted by attacks unless permitted by true sight.)\n\nAt the beginning of your recollection phase, Patient Rogue gets +3 POWER until end of turn.",
      abilities: [
        {
          id: "CvvgJR4fNa-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Patient Rogue has stealth as long as it's awake. (This unit can't be targeted by attacks unless permitted by true sight.)",
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
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "CvvgJR4fNa-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, Patient Rogue gets +3 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default patientRogue;
