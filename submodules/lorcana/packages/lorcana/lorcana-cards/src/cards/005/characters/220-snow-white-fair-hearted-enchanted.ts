import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteFairheartedEnchantedI18n } from "./220-snow-white-fair-hearted-enchanted.i18n";

export const snowWhiteFairheartedEnchanted: CharacterCard = {
  id: "htq",
  canonicalId: "ci_Z93",
  slug: "lorcana-ci_Z93",
  printings: [
    {
      id: "set5-220-enchanted",
      artId: "ci_Z93-enchanted",
      setCode: "set5",
      collectorNumber: "220",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-183"],
  cardType: "character",
  name: "Snow White",
  version: "Fair-Hearted",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 220,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_222e3894d8c04d2899b047a97912b5c6",
    tcgPlayer: "562007",
  },
  text: [
    {
      title: "NATURAL LEADER",
      description:
        "This character gains Resist +1 for each other Knight character you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: {
          type: "classification-character-count",
          classification: "Knight",
          controller: "you",
          excludeSelf: true,
        },
      },
      id: "1ie-1",
      name: "NATURAL LEADER",
      text: "NATURAL LEADER This character gains Resist +1 for each other Knight character you have in play.",
      type: "static",
    },
  ],
  i18n: snowWhiteFairheartedEnchantedI18n,
};
