import type { CharacterCard } from "@tcg/lorcana-types";
import { joshuaSweetTheDoctorI18n } from "./005-joshua-sweet-the-doctor.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const joshuaSweetTheDoctor: CharacterCard = {
  id: "eZE",
  canonicalId: "ci_eZE",
  slug: "lorcana-ci_eZE",
  printings: [
    {
      id: "set3-005",
      artId: "set3-005",
      setCode: "set3",
      collectorNumber: "5",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-005"],
  cardType: "character",
  name: "Joshua Sweet",
  version: "The Doctor",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 5,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3ff14fbe696348d281fb1974bdcd8e5f",
    tcgPlayer: "537753",
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: joshuaSweetTheDoctorI18n,
};
