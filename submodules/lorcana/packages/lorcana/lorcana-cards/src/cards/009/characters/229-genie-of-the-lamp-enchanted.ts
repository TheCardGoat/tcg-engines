import type { CharacterCard } from "@tcg/lorcana-types";
import { genieOfTheLampEnchantedI18n } from "./229-genie-of-the-lamp-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const genieOfTheLampEnchanted: CharacterCard = {
  id: "yah",
  canonicalId: "ci_jXl",
  slug: "lorcana-ci_jXl",
  printings: [
    {
      id: "set9-229-enchanted",
      artId: "ci_jXl-enchanted",
      setCode: "set9",
      collectorNumber: "229",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set9-076"],
  cardType: "character",
  name: "Genie",
  version: "Of the Lamp",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "009",
  cardNumber: 229,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aed92d8e19b14ef19a92fb436dde357c",
    tcgPlayer: "651118",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "LET'S MAKE SOME MAGIC",
      description: "While this character is exerted, your other characters get +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    evasive,
    {
      condition: {
        type: "exerted",
      },
      name: "LET'S MAKE SOME MAGIC",
      effect: {
        modifier: 2,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "msr-2",
      text: "LET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
      type: "static",
    },
  ],
  i18n: genieOfTheLampEnchantedI18n,
};
