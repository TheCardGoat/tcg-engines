import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stormSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "blqryebvwj",
  slug: "storm-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "blqryebvwj:face:default",
      catalogId: "blqryebvwj",
      name: "Storm Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText:
        "Pride 3\n\nOn Enter: As a Spell, deal damage to target unit equal to the number of Slime cards in your banishment.\n\n[Class Bonus] On Death: You may banish two cards at random from your memory. If you do, draw two cards.",
      abilities: [
        {
          id: "blqryebvwj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "blqryebvwj-a2",
          kind: "triggered",
          text: "On Enter: As a Spell, deal damage to target unit equal to the number of Slime cards in your banishment.",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SLIME"],
                  },
                },
              },
            },
          },
        },
        {
          id: "blqryebvwj-a3",
          kind: "triggered",
          text: "[Class Bonus] On Death: You may banish two cards at random from your memory. If you do, draw two cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
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
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                    method: "random",
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default stormSlime;
