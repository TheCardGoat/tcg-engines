import type { CharacterCard } from "@tcg/lorcana-types";
import { peteSuaveShowoffI18n } from "./005-pete-suave-showoff.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const peteSuaveShowoff: CharacterCard = {
  id: "C4O",
  canonicalId: "ci_C4O",
  slug: "lorcana-ci_C4O",
  printings: [
    {
      id: "set14-005",
      artId: "set14-005",
      setCode: "set14",
      collectorNumber: "5",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-005"],
  cardType: "character",
  name: "Pete",
  version: "Suave Showoff",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 5,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fb3447e25919489481692c3d225aab3e",
  },
  text: "Bodyguard",
  classifications: ["Storyborn"],
  abilities: [bodyguard],
  i18n: peteSuaveShowoffI18n,
};
