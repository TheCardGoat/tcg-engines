import type { CharacterCard } from "@tcg/lorcana-types";
import { fergusKingOfDunbrochI18n } from "./175-fergus-king-of-dunbroch.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const fergusKingOfDunbroch: CharacterCard = {
  id: "Yws",
  canonicalId: "ci_Yws",
  slug: "lorcana-ci_Yws",
  printings: [
    {
      id: "set12-175",
      artId: "set12-175",
      setCode: "set12",
      collectorNumber: "175",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-175"],
  cardType: "character",
  name: "Fergus",
  version: "King of DunBroch",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 175,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_69abd1ffb3804061a4f46555ad029609",
    tcgPlayer: "692194",
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [bodyguard],
  i18n: fergusKingOfDunbrochI18n,
};
