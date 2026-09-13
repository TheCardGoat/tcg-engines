import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const majesticSpiritsCrest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Tx6iJQNSA6",
  slug: "majestic-spirits-crest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Tx6iJQNSA6:face:default",
      catalogId: "Tx6iJQNSA6",
      name: "Majestic Spirit's Crest",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ACCESSORY"],
      },
      elements: ["CRUX"],
      stats: {},
      rulesText:
        '[Class Bonus] Banish Majestic Spirit\'s Crest: Your champion gains "On Attack: Draw a card" until end of turn.',
      abilities: [
        {
          id: "Tx6iJQNSA6-a1",
          kind: "activated",
          text: '[Class Bonus] Banish Majestic Spirit\'s Crest: Your champion gains "On Attack: Draw a card" until end of turn.',
          activation: "ability",
          cost: {
            kind: "banish-self",
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
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-14lnc4b-a1",
                kind: "triggered",
                text: "On Attack: Draw a card",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "source",
                    },
                  },
                },
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default majesticSpiritsCrest;
