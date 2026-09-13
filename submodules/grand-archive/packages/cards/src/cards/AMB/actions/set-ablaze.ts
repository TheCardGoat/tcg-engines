import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const setAblaze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d4z3tj2nu8",
  slug: "set-ablaze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d4z3tj2nu8:face:default",
      catalogId: "d4z3tj2nu8",
      name: "Set Ablaze",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal 4 damage to target ally.\n\n[Class Bonus] [Level 3+] Deal 3 damage to each champion controlled by the same player as that ally.",
      abilities: [
        {
          id: "d4z3tj2nu8-a1",
          kind: "card-resolution",
          text: "Deal 4 damage to target ally.",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 4,
          },
        },
        {
          id: "d4z3tj2nu8-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 3+] Deal 3 damage to each champion controlled by the same player as that ally.",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: {
                  controllerOf: "target-1",
                },
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default setAblaze;
