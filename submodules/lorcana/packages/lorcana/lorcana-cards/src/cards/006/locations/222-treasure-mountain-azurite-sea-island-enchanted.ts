import type { LocationCard } from "@tcg/lorcana-types";
import { treasureMountainAzuriteSeaIslandEnchantedI18n } from "./222-treasure-mountain-azurite-sea-island-enchanted.i18n";

export const treasureMountainAzuriteSeaIslandEnchanted: LocationCard = {
  id: "Ubs",
  canonicalId: "ci_To9",
  slug: "lorcana-ci_To9",
  printings: [
    {
      id: "set6-222-enchanted",
      artId: "ci_To9-enchanted",
      setCode: "set6",
      collectorNumber: "222",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-203"],
  cardType: "location",
  name: "Treasure Mountain",
  version: "Azurite Sea Island",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 222,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  willpower: 9,
  moveCost: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c343d1fc29f3491f95bb460c90e081a7",
    tcgPlayer: "593162",
  },
  text: [
    {
      title: "SECRET WEAPON",
      description:
        "At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
    },
  ],
  abilities: [
    {
      id: "7id-1",
      name: "SECRET WEAPON",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        amount: {
          type: "source-attribute",
          attribute: "chars-at-location",
        },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "location"],
        },
        type: "deal-damage",
      },
      text: "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
      type: "triggered",
    },
  ],
  i18n: treasureMountainAzuriteSeaIslandEnchantedI18n,
};
