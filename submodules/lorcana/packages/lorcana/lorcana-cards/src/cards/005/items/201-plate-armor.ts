import type { ItemCard } from "@tcg/lorcana-types";
import { plateArmorI18n } from "./201-plate-armor.i18n";

export const plateArmor: ItemCard = {
  id: "12X",
  canonicalId: "ci_12X",
  reprints: ["set5-201"],
  cardType: "item",
  name: "Plate Armor",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 201,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_170330e953034b0b84419cfff824f737",
    tcgPlayer: 561195,
  },
  text: [
    {
      title: "WELL CRAFTED",
      description: "{E} — Chosen character gains Resist +2 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 2,
      },
      id: "14f-1",
      name: "WELL CRAFTED",
      text: "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: plateArmorI18n,
};
