import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohPigletHunnyMages } from "./062-winnie-the-pooh-piglet-hunny-mages";
import { winnieThePoohPigletHunnyMagesEnchantedI18n } from "./234-winnie-the-pooh-piglet-hunny-mages-enchanted.i18n";

export const winnieThePoohPigletHunnyMagesEnchanted: CharacterCard = {
  id: "5EY",
  canonicalId: "ci_NXy",
  slug: "lorcana-ci_NXy",
  printings: [
    {
      id: "set13-234-enchanted",
      artId: "ci_NXy-enchanted",
      setCode: "set13",
      collectorNumber: "234",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-062"],
  cardType: "character",
  name: "Winnie the Pooh & Piglet",
  version: "Hunny Mages",
  inkType: ["amethyst", "sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 234,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e2c9423df7b4642914deccabf922ff5",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "MAGICAL MIX",
      description:
        "This character gets +1 {L} for each different ink type of characters you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Team", "Hero", "Sorcerer", "Hunny"],
  abilities: winnieThePoohPigletHunnyMages.abilities,
  i18n: winnieThePoohPigletHunnyMagesEnchantedI18n,
};
