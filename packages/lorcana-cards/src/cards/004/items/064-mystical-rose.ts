import type { ItemCard } from "@tcg/lorcana";

export const mysticalRose: ItemCard = {
  id: "1il",
  cardType: "item",
  name: "Mystical Rose",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  externalIds: {
    ravensburger: "c4c4f0e3ace8d22946df975891f7711d501b13c5",
  },
  abilities: [
    {
      id: "1il-1",
      text: "DISPEL THE ENTANGLEMENT Banish this item — Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
      name: "DISPEL THE ENTANGLEMENT",
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 0,
            target: {
              selector: "chosen",
              count: { exactly: 1 },
              filter: [{ type: "has-name", name: "Beast" }],
            },
            duration: "this-turn",
          },
          {
            type: "conditional",
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
                count: { exactly: 1 },
              },
              to: {
                selector: "chosen",
                count: { exactly: 1 },
                filter: [{ type: "owner", owner: "opponent" }],
              },
            },
          },
        ],
      },
    },
  ],
};
