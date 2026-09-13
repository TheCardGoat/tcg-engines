import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const executionersSpear: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zv6yp6q7zw",
  slug: "executioners-spear",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zv6yp6q7zw:face:default",
      catalogId: "zv6yp6q7zw",
      name: "Executioner's Spear",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "(Weapon — Enters the field with two durability counters. Weapons allow your champion to perform an attack, and can be used along with an attack card.)\n\n[Jin Bonus] On Kill: Put a durability counter on Executioner's Spear. (Apply this effect only if your champion is Jin.)",
      abilities: [
        {
          id: "zv6yp6q7zw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Weapon — Enters the field with two durability counters. Weapons allow your champion to perform an attack, and can be used along with an attack card.)",
          keyword: {
            name: "weapon-procedure",
          },
        },
        {
          id: "zv6yp6q7zw-a2",
          kind: "triggered",
          text: "[Jin Bonus] On Kill: Put a durability counter on Executioner's Spear. (Apply this effect only if your champion is Jin.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
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
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "durability",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default executionersSpear;
