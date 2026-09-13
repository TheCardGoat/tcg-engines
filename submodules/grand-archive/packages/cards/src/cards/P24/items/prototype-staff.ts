import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prototypeStaff: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8c9htu9agw",
  slug: "prototype-staff",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8c9htu9agw:face:default",
      catalogId: "8c9htu9agw",
      name: "Prototype Staff",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "STAFF"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] [Memory 4+] Your champion gets +1 level. (Apply this effect only there are four or more cards in your memory.)\n\n[Level 4+] REST: You may put a card from your hand on the bottom of your deck. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "8c9htu9agw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Memory 4+] Your champion gets +1 level. (Apply this effect only there are four or more cards in your memory.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "8c9htu9agw-a2",
          kind: "activated",
          text: "[Level 4+] REST: You may put a card from your hand on the bottom of your deck. If you do, draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          restrictions: [
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
                  right: 4,
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "returned-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "returned-card",
                    },
                    from: "hand",
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                      },
                    },
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                    to: "memory",
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default prototypeStaff;
