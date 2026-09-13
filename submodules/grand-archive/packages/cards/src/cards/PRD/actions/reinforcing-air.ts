import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reinforcingAir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TrWfgn2PV0",
  slug: "reinforcing-air",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TrWfgn2PV0:face:default",
      catalogId: "TrWfgn2PV0",
      name: "Reinforcing Air",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)\n\nUp to two target Human allies get +2POWER and +2LIFE until end of turn.",
      abilities: [
        {
          id: "TrWfgn2PV0-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "TrWfgn2PV0-a2",
          kind: "card-resolution",
          text: "Up to two target Human allies get +2POWER and +2LIFE until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
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
                  amount: 2,
                },
              },
              {
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
                  property: "life",
                  operation: "add",
                  amount: 2,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default reinforcingAir;
