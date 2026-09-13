import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rococoExplosiveMaven: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m6h38lrj52",
  slug: "rococo-explosive-maven",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m6h38lrj52:face:default",
      catalogId: "m6h38lrj52",
      name: "Rococo, Explosive Maven",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "On Enter: If your influence is four or less, deal 2 damage to target champion. (A player's influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "m6h38lrj52-a1",
          kind: "triggered",
          text: "On Enter: If your influence is four or less, deal 2 damage to target champion. (A player's influence is equal to the total amount of cards in their hand and memory.)",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "player-property",
                  player: "controller",
                  property: "influence",
                },
                operator: "lte",
                right: 4,
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default rococoExplosiveMaven;
