import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const emberslash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0xylS3OcNa",
  slug: "emberslash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0xylS3OcNa:face:default",
      catalogId: "0xylS3OcNa",
      name: "Emberslash",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "(Attack cards allow your champion to perform an attack with up to one weapon. Rest your champion as an additional cost to activate this card.)\n\n[Class Bonus] On Attack: You may discard a card. If you do, draw a card.",
      abilities: [
        {
          id: "0xylS3OcNa-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Attack cards allow your champion to perform an attack with up to one weapon. Rest your champion as an additional cost to activate this card.)",
          keyword: {
            name: "attack-procedure",
          },
        },
        {
          id: "0xylS3OcNa-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may discard a card. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
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
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
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

export default emberslash;
