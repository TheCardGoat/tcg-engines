import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanSparkAlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cm1pdhFEz7",
  slug: "aenean-spark-alight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cm1pdhFEz7:face:default",
      catalogId: "cm1pdhFEz7",
      name: "Aenean Spark Alight",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 2 unpreventable damage to target unit.\n\n[Class Bonus][Level 3+] Deal 3 unpreventable damage to that unit instead.\n\n[Class Bonus][Level 6+] Draw a card into your memory.",
      abilities: [
        {
          id: "cm1pdhFEz7-a1",
          kind: "card-resolution",
          text: "Deal 2 unpreventable damage to target unit.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 2,
            preventable: false,
          },
        },
        {
          id: "cm1pdhFEz7-a2",
          kind: "ability-modifier",
          text: "[Class Bonus][Level 3+] Deal 3 unpreventable damage to that unit instead.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "replace-effect",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 3,
              preventable: false,
            },
          },
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
        },
        {
          id: "cm1pdhFEz7-a3",
          kind: "card-resolution",
          text: "[Class Bonus][Level 6+] Draw a card into your memory.",
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
                  right: 6,
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

export default aeneanSparkAlight;
