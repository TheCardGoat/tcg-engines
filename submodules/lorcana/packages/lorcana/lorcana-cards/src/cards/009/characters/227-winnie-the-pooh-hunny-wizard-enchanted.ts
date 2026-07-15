import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHunnyWizardEnchantedI18n } from "./227-winnie-the-pooh-hunny-wizard-enchanted.i18n";

export const winnieThePoohHunnyWizardEnchanted: CharacterCard = {
  id: "Lqq",
  canonicalId: "ci_ITi",
  slug: "lorcana-ci_ITi",
  printings: [
    {
      id: "set9-227-enchanted",
      artId: "ci_ITi-enchanted",
      setCode: "set9",
      collectorNumber: "227",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set2-059", "set9-041"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hunny Wizard",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "009",
  cardNumber: 227,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_69d9b22e10244e2fb65ffbdb5f99da83",
    tcgPlayer: "651107",
  },
  classifications: ["Dreamborn", "Hero", "Sorcerer", "Hunny"],
  i18n: winnieThePoohHunnyWizardEnchantedI18n,
};
