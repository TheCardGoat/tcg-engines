import type { ItemCard } from "@tcg/lorcana-types";

export const magicGoldenFlower: ItemCard = {
  id: "1dk",
  cardType: "item",
  name: "Magic Golden Flower",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "001",
  text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
  cost: 1,
  cardNumber: 169,
  inkable: true,
  externalIds: {
    ravensburger: "b14e84279a07a659f613dce649d53864d810ff65",
  },
  abilities: [
    {
      id: "1dk-1",
      text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
      name: "HEALING POLLEN",
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "remove-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
        upTo: true,
      },
    },
  ],
};
