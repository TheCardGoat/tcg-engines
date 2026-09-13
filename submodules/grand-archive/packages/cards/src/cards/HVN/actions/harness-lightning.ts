import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harnessLightning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bzwj7ztr78",
  slug: "harness-lightning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bzwj7ztr78:face:default",
      catalogId: "bzwj7ztr78",
      name: "Harness Lightning",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE", "TAMER"],
        subtypes: ["MAGE", "TAMER", "SKILL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As long as you control an arcane element Shenju ally, ignore this card's elemental requirements as you activate it.\n\nChoose one—\n• Empower 4. Then banish Harness Lightning.\n• Target ally gets +4 POWER until end of turn. Then banish Harness Lightning.",
      abilities: [
        {
          id: "bzwj7ztr78-a1",
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
          id: "bzwj7ztr78-a2",
          kind: "card-resolution",
          text: "Choose one—\n• Empower 4. Then banish Harness Lightning.\n• Target ally gets +4 POWER until end of turn. Then banish Harness Lightning.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Empower 4. Then banish Harness Lightning.",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "keyword-action",
                      action: "empower",
                      amount: 4,
                    },
                    {
                      kind: "banish-object",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
              },
              {
                id: "mode-2",
                text: "Target ally gets +4 POWER until end of turn. Then banish Harness Lightning",
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
                        amount: 4,
                      },
                    },
                    {
                      kind: "banish-object",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default harnessLightning;
