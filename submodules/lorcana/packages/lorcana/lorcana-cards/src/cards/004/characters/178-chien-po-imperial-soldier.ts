import type { CharacterCard } from "@tcg/lorcana-types";
import { chienpoImperialSoldierI18n } from "./178-chien-po-imperial-soldier.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const chienpoImperialSoldier: CharacterCard = {
  id: "Z6w",
  canonicalId: "ci_Z6w",
  slug: "lorcana-ci_Z6w",
  printings: [
    {
      id: "set4-178",
      artId: "set4-178",
      setCode: "set4",
      collectorNumber: "178",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-178"],
  cardType: "character",
  name: "Chien-Po",
  version: "Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 178,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dd040ced1dd34dab9d822a6584cdc41d",
    tcgPlayer: "548194",
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: chienpoImperialSoldierI18n,
};
