import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanFlurryOfFire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6Sv5qIpglQ",
  slug: "aenean-flurry-of-fire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6Sv5qIpglQ:face:default",
      catalogId: "6Sv5qIpglQ",
      name: "Aenean Flurry of Fire",
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
      speed: "slow",
      stats: {},
      rulesText:
        "Deal 1 damage to target unit twice.\n\n[Class Bonus] [Level 5+] Deal 1 damage to that unit two more times.",
      abilities: [
        {
          id: "6Sv5qIpglQ-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit twice.",
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
            kind: "repeat",
            count: 2,
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 1,
            },
          },
        },
        {
          id: "6Sv5qIpglQ-a2",
          kind: "ability-modifier",
          text: "[Class Bonus] [Level 5+] Deal 1 damage to that unit two more times.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          operation: {
            kind: "repeat-effect",
            additionalTimes: 2,
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
                  right: 5,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default aeneanFlurryOfFire;
