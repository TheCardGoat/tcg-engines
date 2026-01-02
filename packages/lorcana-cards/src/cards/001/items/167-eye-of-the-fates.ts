import type { ItemCard } from "@tcg/lorcana-types";

export const eyeOfTheFates: ItemCard = {
  id: "dun",
  cardType: "item",
  name: "Eye of the Fates",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
  cost: 4,
  cardNumber: 167,
  inkable: true,
  externalIds: {
    ravensburger: "31ec2dd1c4e99314e1f758de9ca87d581629a5a9",
  },
  abilities: [
    {
      id: "dun-1",
      text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
      name: "SEE THE FUTURE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};
