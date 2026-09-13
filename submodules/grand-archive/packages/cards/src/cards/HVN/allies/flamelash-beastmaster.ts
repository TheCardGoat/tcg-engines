import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flamelashBeastmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mvgmaalpko",
  slug: "flamelash-beastmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mvgmaalpko:face:default",
      catalogId: "mvgmaalpko",
      name: "Flamelash Beastmaster",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Target Beast ally you control gets +3 power until end of turn.",
      abilities: [
        {
          id: "mvgmaalpko-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Target Beast ally you control gets +3 power until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
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
              property: "level",
              operation: "add",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default flamelashBeastmaster;
