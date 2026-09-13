import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inundatingClash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "welp9q7c5l",
  slug: "inundating-clash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "welp9q7c5l:face:default",
      catalogId: "welp9q7c5l",
      name: "Inundating Clash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AXE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] On Attack: If the attacker is attacking a rested unit, Inundating Clash gets +3 POWER.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "welp9q7c5l-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If the attacker is attacking a rested unit, Inundating Clash gets +3 POWER.",
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
            kind: "conditional",
            condition: {
              kind: "combat-relation",
              relation: "attacking",
              subject: {
                kind: "event-attacker",
              },
              otherFilter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                  {
                    kind: "object-state",
                    state: "rested",
                  },
                ],
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 3,
              },
            },
          },
        },
        {
          id: "welp9q7c5l-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default inundatingClash;
