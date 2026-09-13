import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const yuanShaoCrownGeneral: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x8o84m37ti",
  slug: "yuan-shao-crown-general",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x8o84m37ti:face:default",
      catalogId: "x8o84m37ti",
      name: "Yuan Shao, Crown General",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Unique allies your opponents control have pride 2.\n\n[Level 2+] (3), REST: As a Spell, gain control of target unique ally. Activate this ability only if there are three or more unique allies on the field you don't control.\n",
      abilities: [
        {
          id: "x8o84m37ti-a1",
          kind: "static",
          staticKind: "effects",
          text: "Unique allies your opponents control have pride 2.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
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
                  name: "pride",
                  value: 2,
                },
              },
            },
          ],
        },
        {
          id: "x8o84m37ti-a2",
          kind: "activated",
          text: "[Level 2+] (3), REST: As a Spell, gain control of target unique ally. Activate this ability only if there are three or more unique allies on the field you don't control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          targets: [
            {
              id: "target-unique-ally",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["UNIQUE"],
                    },
                  ],
                },
              },
            },
          ],
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
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "change-control",
              subject: {
                kind: "bound",
                binding: "target-unique-ally",
              },
              controller: "controller",
            },
          },
        },
      ],
    },
  },
};

export default yuanShaoCrownGeneral;
