import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const revenantsScourge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r5a3pmmloe",
  slug: "revenants-scourge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r5a3pmmloe:face:default",
      catalogId: "r5a3pmmloe",
      name: "Revenant's Scourge",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] On Champion Hit: If there are one or more Curse cards in the hit champion’s lineage, wake up the attacker and draw a card. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "r5a3pmmloe-a1",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: If there are one or more Curse cards in the hit champion’s lineage, wake up the attacker and draw a card. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
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
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["inner-lineage"],
                host: {
                  kind: "event-recipient",
                },
                relationship: "lineage-of",
                filter: {
                  kind: "subtype",
                  oneOf: ["CURSE"],
                },
              },
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "wake",
                  subject: {
                    kind: "event-attacker",
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default revenantsScourge;
