import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const insigniaOfTheCorhazi: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "52u81v4c0z",
  slug: "insignia-of-the-corhazi",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "52u81v4c0z:face:default",
      catalogId: "52u81v4c0z",
      name: "Insignia of the Corhazi",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ARTIFACT"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "(3), REST: Put a preparation counter on your champion.\n\n[Class Bonus] Whenever you activate a prepared card while your influence is six or less, draw a card into your memory.",
      abilities: [
        {
          id: "52u81v4c0z-a1",
          kind: "activated",
          text: "(3), REST: Put a preparation counter on your champion.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
        {
          id: "52u81v4c0z-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate a prepared card while your influence is six or less, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "activation-state",
                  state: "prepared",
                },
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "player-property",
                    player: "controller",
                    property: "influence",
                  },
                  operator: "lte",
                  right: 6,
                },
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

export default insigniaOfTheCorhazi;
