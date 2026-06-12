import type { CharacterCard } from "@tcg/lorcana-types";
import { grammaTalaSpiritOfTheOceanI18n } from "./143-gramma-tala-spirit-of-the-ocean.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const grammaTalaSpiritOfTheOcean: CharacterCard = {
  id: "0Rd",
  canonicalId: "ci_l6C",
  reprints: ["set3-143"],
  cardType: "character",
  name: "Gramma Tala",
  version: "Spirit of the Ocean",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  cardNumber: 143,
  rarity: "legendary",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7ad03b4873f042bcae4da820a7061ba4",
    tcgPlayer: 539275,
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
  i18n: grammaTalaSpiritOfTheOceanI18n,
};
