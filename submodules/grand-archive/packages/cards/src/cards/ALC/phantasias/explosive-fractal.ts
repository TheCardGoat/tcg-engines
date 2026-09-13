import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const explosiveFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1d47o7eanl",
  slug: "explosive-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1d47o7eanl:face:default",
      catalogId: "1d47o7eanl",
      name: "Explosive Fractal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] [Memory 4+] On Enter: Deal 2 damage to target champion. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)\n\nReservable",
      abilities: [
        {
          id: "1d47o7eanl-a1",
          kind: "triggered",
          text: "[Class Bonus] [Memory 4+] On Enter: Deal 2 damage to target champion. (Apply this effect only if your champion's class matches this card's class and only if there are four or more cards in your memory.)",
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
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "gte",
                  right: 4,
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
          },
        },
        {
          id: "1d47o7eanl-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default explosiveFractal;
