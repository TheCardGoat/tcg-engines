import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const safeguardAmulet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yj2rJBREH8",
  slug: "safeguard-amulet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yj2rJBREH8:face:default",
      catalogId: "yj2rJBREH8",
      name: "Safeguard Amulet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Safeguard Amulet: If your champion would take non-combat damage this turn, prevent 4 of that damage.",
      abilities: [
        {
          id: "yj2rJBREH8-a1",
          kind: "activated",
          text: "Banish Safeguard Amulet: If your champion would take non-combat damage this turn, prevent 4 of that damage.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "replacement",
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
              combatDamage: false,
            },
            operation: {
              kind: "prevent",
              amount: 4,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default safeguardAmulet;
