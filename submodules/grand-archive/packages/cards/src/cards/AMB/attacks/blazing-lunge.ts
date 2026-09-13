import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingLunge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wewvlfkfp7",
  slug: "blazing-lunge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wewvlfkfp7:face:default",
      catalogId: "wewvlfkfp7",
      name: "Blazing Lunge",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
      },
      rulesText:
        '[Class Bonus] Banish two fire element cards from your graveyard: Blazing Lunge gains "Combat damage dealt by this attack is unpreventable." (Activate this ability only while this card is in an intent.)',
      abilities: [
        {
          id: "wewvlfkfp7-a1",
          kind: "activated",
          text: '[Class Bonus] Banish two fire element cards from your graveyard: Blazing Lunge gains "Combat damage dealt by this attack is unpreventable." (Activate this ability only while this card is in an intent.)',
          activation: "ability",
          functionalZones: ["intent"],
          cost: {
            kind: "select-and-move",
            player: "controller",
            from: "graveyard",
            to: "banishment",
            count: {
              kind: "exactly",
              amount: 2,
            },
            filter: {
              kind: "element",
              oneOf: ["FIRE"],
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-dp8szm-a1",
                kind: "static",
                staticKind: "effects",
                text: "Combat damage dealt by this attack is unpreventable.",
                effects: [
                  {
                    kind: "rule-modification",
                    mode: "forbid",
                    action: "prevent-damage",
                    using: {
                      kind: "source",
                    },
                    damageKind: "combat",
                    duration: {
                      kind: "while-source-in-functional-zone",
                    },
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

export default blazingLunge;
