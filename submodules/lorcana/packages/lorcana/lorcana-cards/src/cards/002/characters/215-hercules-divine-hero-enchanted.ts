import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesDivineHeroEnchantedI18n } from "./215-hercules-divine-hero-enchanted.i18n";

import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";

export const herculesDivineHeroEnchanted: CharacterCard = {
  id: "X9s",
  canonicalId: "ci_1UQ",
  slug: "lorcana-ci_1UQ",
  printings: [
    {
      id: "set2-215-enchanted",
      artId: "ci_1UQ-enchanted",
      setCode: "set2",
      collectorNumber: "215",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set2-181"],
  cardType: "character",
  name: "Hercules",
  version: "Divine Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_42ef053d7aab445fa7b0a2bf2e028864",
    tcgPlayer: "528113",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "Resist +2",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince", "Deity"],
  abilities: [shift(4), resist(2)],
  i18n: herculesDivineHeroEnchantedI18n,
};
