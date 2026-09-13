import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seafletchedSerpent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h0g7nndc4s",
  slug: "seafletched-serpent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h0g7nndc4s:face:default",
      catalogId: "h0g7nndc4s",
      name: "Seafletched Serpent",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER", "TAMER"],
        subtypes: ["RANGER", "TAMER", "BEAST", "SERPENT"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)\n\n[Class Bonus] On Hit: You may load Seafletched Serpent into target unloaded Bow weapon you control.",
      abilities: [
        {
          id: "h0g7nndc4s-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "h0g7nndc4s-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: You may load Seafletched Serpent into target unloaded Bow weapon you control.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BOW"],
                    },
                  ],
                },
              },
            },
          ],
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "move",
              subject: {
                kind: "source",
              },
              destination: {
                zone: "loaded",
                host: {
                  kind: "bound",
                  binding: "target-weapon",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default seafletchedSerpent;
