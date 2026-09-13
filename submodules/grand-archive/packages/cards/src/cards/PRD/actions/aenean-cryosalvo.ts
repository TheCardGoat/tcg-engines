import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanCryosalvo: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NHTouMzz3o",
  slug: "aenean-cryosalvo",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NHTouMzz3o:face:default",
      catalogId: "NHTouMzz3o",
      name: "Aenean Cryosalvo",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] [Level 5+] Until end of turn, if a Fractal source you control would deal damage, it deals that much damage plus 1 instead. \n\nEach Fractal object you control deals 1 damage to target unit.",
      abilities: [
        {
          id: "NHTouMzz3o-a1",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 5+] Until end of turn, if a Fractal source you control would deal damage, it deals that much damage plus 1 instead.",
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
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["FRACTAL"],
                },
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "add",
              amount: 1,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "NHTouMzz3o-a2",
          kind: "card-resolution",
          text: "Each Fractal object you control deals 1 damage to target unit.",
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
            kind: "for-each",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["FRACTAL"],
              },
            },
            bindEachAs: "damage-source",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "bound",
                binding: "damage-source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default aeneanCryosalvo;
