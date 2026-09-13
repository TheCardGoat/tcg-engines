import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fanOfInsight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sz1ty7vq6z",
  slug: "fan-of-insight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sz1ty7vq6z:face:default",
      catalogId: "sz1ty7vq6z",
      name: "Fan of Insight",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FAN"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] [Level 2+] On Enter: Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)\n\nBanish Fan of Insight: Return a card from your memory to your hand.",
      abilities: [
        {
          id: "sz1ty7vq6z-a1",
          kind: "triggered",
          text: "[Class Bonus] [Level 2+] On Enter: Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
                  right: 2,
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
        {
          id: "sz1ty7vq6z-a2",
          kind: "activated",
          text: "Banish Fan of Insight: Return a card from your memory to your hand.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
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
                zones: ["memory"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "returned-card",
              },
              from: "memory",
              destination: {
                zone: "hand",
              },
            },
          },
        },
      ],
    },
  },
};

export default fanOfInsight;
