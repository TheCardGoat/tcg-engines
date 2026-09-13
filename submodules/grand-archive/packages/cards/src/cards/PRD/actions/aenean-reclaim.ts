import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanReclaim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DCzUre54F9",
  slug: "aenean-reclaim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DCzUre54F9:face:default",
      catalogId: "DCzUre54F9",
      name: "Aenean Reclaim",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "AENEAN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Return target ally you control to its owner’s hand.\n\n[Class Bonus] [Level 3+] Draw a card into your memory.",
      abilities: [
        {
          id: "DCzUre54F9-a1",
          kind: "card-resolution",
          text: "Return target ally you control to its owner’s hand.",
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
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "hand",
            },
          },
        },
        {
          id: "DCzUre54F9-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 3+] Draw a card into your memory.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default aeneanReclaim;
