import type { ItemCard } from "@tcg/lorcana-types";

export const mysticalRose: ItemCard = {
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 0,
            stat: "lore",
            target: {
              selector: "chosen",
              count: 1,
              filter: [{ type: "has-name", name: "Beast" }],
            },
            type: "modify-stat",
          },
          {
            condition: {
              type: "has-named-character",
              name: "Belle",
              controller: "you",
            },
            then: {
              type: "move-damage",
              amount: 0,
              from: {
                selector: "chosen",
                count: 1,
              },
              to: {
                selector: "chosen",
                count: 1,
                filter: [{ type: "owner", owner: "opponent" }],
              },
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      id: "1il-1",
      name: "DISPEL THE ENTANGLEMENT",
      text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
      type: "activated",
    },
  ],
  cardNumber: 64,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "c4c4f0e3ace8d22946df975891f7711d501b13c5",
  },
  franchise: "Beauty and the Beast",
  id: "1il",
  inkType: ["amethyst"],
  inkable: true,
  name: "Mystical Rose",
  set: "004",
  text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
};
