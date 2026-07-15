import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseSteamboatPilotEnchantedI18n } from "./231-mickey-mouse-steamboat-pilot-enchanted.i18n";

export const mickeyMouseSteamboatPilotEnchanted: CharacterCard = {
  id: "MCo",
  canonicalId: "ci_5sX",
  slug: "lorcana-ci_5sX",
  printings: [
    {
      id: "set9-231-enchanted",
      artId: "ci_5sX-enchanted",
      setCode: "set9",
      collectorNumber: "231",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-089", "set9-080"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Steamboat Pilot",
  inkType: ["emerald"],
  set: "009",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d72f9b00497a4ff0ac7ddb0f85da659d",
    tcgPlayer: "651112",
  },
  classifications: ["Storyborn", "Hero", "Captain"],
  i18n: mickeyMouseSteamboatPilotEnchantedI18n,
};
