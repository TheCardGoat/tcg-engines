import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const attuneWithFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nvx7mnu1xh",
  slug: "attune-with-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nvx7mnu1xh:face:default",
      catalogId: "nvx7mnu1xh",
      name: "Attune with Flames",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "CRAFT"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nActivate this card only during an opponent's recollection phase.\n\nTarget Guardian weapon you control gets +5 POWER until the end of your next turn.",
      abilities: [
        {
          id: "nvx7mnu1xh-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nvx7mnu1xh-a2",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's recollection phase.",
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
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
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
          id: "nvx7mnu1xh-a3",
          kind: "card-resolution",
          text: "Target Guardian weapon you control gets +5 POWER until the end of your next turn.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUARDIAN"],
                    },
                  ],
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
              kind: "until-end-of-turn",
              whose: "controller",
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
              amount: 5,
            },
          },
        },
      ],
    },
  },
};

export default attuneWithFlames;
