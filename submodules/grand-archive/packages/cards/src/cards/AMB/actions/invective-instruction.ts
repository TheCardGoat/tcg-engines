import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const invectiveInstruction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "smr2rn78qo",
  slug: "invective-instruction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "smr2rn78qo:face:default",
      catalogId: "smr2rn78qo",
      name: "Invective Instruction",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target ally gets +3 POWER until end of turn. \n\n[Class Bonus] If you control a non-Human ally, draw a card into your memory. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "smr2rn78qo-a1",
          kind: "card-resolution",
          text: "Target ally gets +3 POWER until end of turn.",
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
              amount: 3,
            },
          },
        },
        {
          id: "smr2rn78qo-a2",
          kind: "card-resolution",
          text: "[Class Bonus] If you control a non-Human ally, draw a card into your memory. (Apply this effect only if your champion’s class matches this card’s class.)",
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
            kind: "conditional",
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
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    },
                  ],
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default invectiveInstruction;
