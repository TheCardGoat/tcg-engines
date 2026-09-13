import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strikingTides: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qrxQGA1pc6",
  slug: "striking-tides",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qrxQGA1pc6:face:default",
      catalogId: "qrxQGA1pc6",
      name: "Striking Tides",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Mordred Bonus] On Hit: You may banish a card with floating memory from your graveyard. If you do, wake up your champion.",
      abilities: [
        {
          id: "qrxQGA1pc6-a1",
          kind: "triggered",
          text: "[Mordred Bonus] On Hit: You may banish a card with floating memory from your graveyard. If you do, wake up your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
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
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "wake",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default strikingTides;
