import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckFlusteredSorcererEnchantedI18n } from "./209-donald-duck-flustered-sorcerer-enchanted.i18n";

export const donaldDuckFlusteredSorcererEnchanted: CharacterCard = {
  id: "8rg",
  canonicalId: "ci_sb1",
  slug: "lorcana-ci_sb1",
  printings: [
    {
      id: "set7-209-enchanted",
      artId: "ci_sb1-enchanted",
      setCode: "set7",
      collectorNumber: "209",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-073"],
  cardType: "character",
  name: "Donald Duck",
  version: "Flustered Sorcerer",
  inkType: ["amethyst"],
  set: "007",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ac531a6c2f3046d3adcffbd1b1e5228e",
    tcgPlayer: "619737",
  },
  text: [
    {
      title: "OBFUSCATE!",
      description: "Opponents need 25 lore to win the game.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Sorcerer"],
  abilities: [
    {
      type: "static",
      name: "OBFUSCATE!",
      text: "OBFUSCATE! Opponents need 25 lore to win the game.",
      effect: {
        type: "win-condition-modification",
        loreRequired: 25,
        target: "OPPONENT",
      },
    },
  ],
  i18n: donaldDuckFlusteredSorcererEnchantedI18n,
};
