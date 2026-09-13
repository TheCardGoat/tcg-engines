import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ornamentalGreatsword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qyQLlDYBlr",
  slug: "ornamental-greatsword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qyQLlDYBlr:face:default",
      catalogId: "qyQLlDYBlr",
      name: "Ornamental Greatsword",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Target ally you control gets +1 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "qyQLlDYBlr-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Target ally you control gets +1 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
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
                  kind: "type",
                  oneOf: ["ALLY"],
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

export default ornamentalGreatsword;
