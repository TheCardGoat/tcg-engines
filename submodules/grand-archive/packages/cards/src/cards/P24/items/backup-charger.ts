import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const backupCharger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9gv4vm4kj3",
  slug: "backup-charger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9gv4vm4kj3:face:default",
      catalogId: "9gv4vm4kj3",
      name: "Backup Charger",
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
        "(3), Banish Backup Charger: Summon a Powercell token rested. Draw a card into your memory.",
      abilities: [
        {
          id: "9gv4vm4kj3-a1",
          kind: "activated",
          text: "(3), Banish Backup Charger: Summon a Powercell token rested. Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Powercell",
                controller: "controller",
                bindResultAs: "summoned-token",
                entersWithStates: ["rested"],
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default backupCharger;
