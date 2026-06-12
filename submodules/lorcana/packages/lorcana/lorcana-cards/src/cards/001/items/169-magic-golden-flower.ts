import type { ItemCard } from "@tcg/lorcana-types";
import { magicGoldenFlowerI18n } from "./169-magic-golden-flower.i18n";

export const magicGoldenFlower: ItemCard = {
  id: "evQ",
  canonicalId: "ci_evQ",
  reprints: ["set1-169"],
  cardType: "item",
  name: "Magic Golden Flower",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 169,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_33a1cfa2557e48ba8b7aac42a10592f6",
    tcgPlayer: 508860,
  },
  text: [
    {
      title: "HEALING POLLEN",
      description: "Banish this item — Remove up to 3 damage from chosen character.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        amount: { type: "up-to", value: 3 },
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      id: "1dk-1",
      name: "HEALING POLLEN",
      text: "HEALING POLLEN Banish this item — Remove up to 3 damage from chosen character.",
      type: "activated",
    },
  ],
  i18n: magicGoldenFlowerI18n,
};
