import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scepterOfLumina: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "e5o3cm9lbe",
  slug: "scepter-of-lumina",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "e5o3cm9lbe:face:default",
      catalogId: "e5o3cm9lbe",
      name: "Scepter of Lumina",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SCEPTER"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever your champion levels up, deal 4 damage to target champion you don't control.\n\n[Level 3+] (5), Banish Scepter of Lumina: Draw a card. (Activate this ability only if your champion is level 3 or higher.)",
      abilities: [
        {
          id: "e5o3cm9lbe-a1",
          kind: "triggered",
          text: "Whenever your champion levels up, deal 4 damage to target champion you don't control.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
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
          id: "e5o3cm9lbe-a2",
          kind: "activated",
          text: "[Level 3+] (5), Banish Scepter of Lumina: Draw a card. (Activate this ability only if your champion is level 3 or higher.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 5,
              },
              {
                kind: "banish-self",
              },
            ],
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
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default scepterOfLumina;
