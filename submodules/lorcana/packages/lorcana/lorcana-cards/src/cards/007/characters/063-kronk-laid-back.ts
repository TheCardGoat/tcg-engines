import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkLaidBackI18n } from "./063-kronk-laid-back.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const kronkLaidBack: CharacterCard = {
  id: "5gf",
  canonicalId: "ci_5gf",
  reprints: ["set7-063"],
  cardType: "character",
  name: "Kronk",
  version: "Laid Back",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 63,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_10a145c920e14c17b01173d348247d95",
    tcgPlayer: 619441,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "I'M LOVIN' THIS",
      description: "If an effect would cause you to discard one or more cards, you don't discard.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      id: "im-lovin-this",
      name: "I'M LOVIN' THIS",
      type: "replacement",
      replaces: "discard",
      replacement: "prevent",
      text: "I'M LOVIN' THIS - If an effect would cause you to discard one or more cards, you don't discard.",
    },
  ],
  i18n: kronkLaidBackI18n,
};
