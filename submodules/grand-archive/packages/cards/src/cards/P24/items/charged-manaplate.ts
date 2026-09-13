import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedManaplate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jxhkurfp66",
  slug: "charged-manaplate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jxhkurfp66:face:default",
      catalogId: "jxhkurfp66",
      name: "Charged Manaplate",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ARMOR"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] Banish Charged Manaplate: Draw a card. Activate this ability only if your champion has taken 4 or more damage this turn. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "jxhkurfp66-a1",
          kind: "activated",
          text: "[Class Bonus] Banish Charged Manaplate: Draw a card. Activate this ability only if your champion has taken 4 or more damage this turn. (Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "event-total",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                window: "this-turn",
                metric: "event-amount",
              },
              operator: "gte",
              right: 4,
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
          },
        },
      ],
    },
  },
};

export default chargedManaplate;
