import type { CharacterCard } from "@tcg/lorcana-types";
import { goofySuperGoofEnchantedI18n } from "./214-goofy-super-goof-enchanted.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const goofySuperGoofEnchanted: CharacterCard = {
  id: "MG7",
  canonicalId: "ci_EA0",
  slug: "lorcana-ci_EA0",
  printings: [
    {
      id: "set4-214-enchanted",
      artId: "ci_EA0-enchanted",
      setCode: "set4",
      collectorNumber: "214",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set4-107"],
  cardType: "character",
  name: "Goofy",
  version: "Super Goof",
  inkType: ["ruby"],
  set: "004",
  cardNumber: 214,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3088ee50256240d0b22c045f593df9a8",
    tcgPlayer: "550542",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "SUPER PEANUT POWERS",
      description: "Whenever this character challenges another character, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    rush,
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1n2-2",
      name: "SUPER PEANUT POWERS",
      text: "SUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
      trigger: {
        defender: {},
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofySuperGoofEnchantedI18n,
};
