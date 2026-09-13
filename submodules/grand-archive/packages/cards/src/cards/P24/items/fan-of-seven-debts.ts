import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fanOfSevenDebts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k9zhw0gbov",
  slug: "fan-of-seven-debts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k9zhw0gbov:face:default",
      catalogId: "k9zhw0gbov",
      name: "Fan of Seven Debts",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FAN"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\n[Kongming Bonus] Banish Fan of Seven Debts: Change the direction of your Shifting Currents to a different direction of your choice.",
      abilities: [
        {
          id: "k9zhw0gbov-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
        {
          id: "k9zhw0gbov-a2",
          kind: "activated",
          text: "[Kongming Bonus] Banish Fan of Seven Debts: Change the direction of your Shifting Currents to a different direction of your choice.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "choose-direction",
            player: "controller",
            state: "shifting-currents",
            directions: ["north", "east", "south", "west"],
            differentFromCurrent: true,
          },
        },
      ],
    },
  },
};

export default fanOfSevenDebts;
