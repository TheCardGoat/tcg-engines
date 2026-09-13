import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const standFast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ao1cfkhbp6",
  slug: "stand-fast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ao1cfkhbp6:face:default",
      catalogId: "ao1cfkhbp6",
      name: "Stand Fast",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during your end phase.\n\nWake up target ally you control. It gains taunt and gets +1 LIFE until the beginning of your next turn. (An awake ally with taunt must be targeted before other units you control during your opponents' attack declarations if able.)",
      abilities: [
        {
          id: "ao1cfkhbp6-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during your end phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "end",
                  },
                  {
                    kind: "turn-player",
                    player: "controller",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ao1cfkhbp6-a2",
          kind: "card-resolution",
          text: "Wake up target ally you control. It gains taunt and gets +1 LIFE until the beginning of your next turn. (An awake ally with taunt must be targeted before other units you control during your opponents' attack declarations if able.)",
          targets: [
            {
              id: "target-ally",
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
            kind: "sequence",
            effects: [
              {
                kind: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-ally",
                },
                affectedSet: "locked",
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "taunt",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-ally",
                },
                affectedSet: "locked",
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
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
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default standFast;
