import type { CharacterCard } from "@tcg/lorcana-types";
import { grammaTalaSpiritOfTheOceanEnchantedI18n } from "./217-gramma-tala-spirit-of-the-ocean-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const grammaTalaSpiritOfTheOceanEnchanted: CharacterCard = {
  id: "8Ws",
  canonicalId: "ci_l6C",
  slug: "lorcana-ci_l6C",
  printings: [
    {
      id: "set3-217-enchanted",
      artId: "ci_l6C-enchanted",
      setCode: "set3",
      collectorNumber: "217",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-143"],
  cardType: "character",
  name: "Gramma Tala",
  version: "Spirit of the Ocean",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  cardNumber: 217,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7ad03b4873f042bcae4da820a7061ba4",
    tcgPlayer: "539275",
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "DO YOU KNOW WHO YOU ARE?",
      description: "Whenever a card is put into your inkwell, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Mentor"],
  abilities: [
    shift(5),
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1xw-2",
      name: "DO YOU KNOW WHO YOU ARE?",
      text: "DO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: grammaTalaSpiritOfTheOceanEnchantedI18n,
};
