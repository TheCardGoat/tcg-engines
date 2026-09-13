import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heatwaveGenerator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fzcyfrzrpl",
  slug: "heatwave-generator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fzcyfrzrpl:face:default",
      catalogId: "fzcyfrzrpl",
      name: "Heatwave Generator",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DEVICE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nAt the beginning of your recollection phase, target ally you control gets +1 POWER until end of turn.",
      abilities: [
        {
          id: "fzcyfrzrpl-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "fzcyfrzrpl-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, target ally you control gets +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
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
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default heatwaveGenerator;
