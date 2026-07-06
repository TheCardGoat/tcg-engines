import type { CharacterCard } from "@tcg/lorcana-types";
import { scarCreatedByTheVine } from "./194-scar-created-by-the-vine";
import { scarCreatedByTheVineEnchantedI18n } from "./243-scar-created-by-the-vine-enchanted.i18n";

export const scarCreatedByTheVineEnchanted: CharacterCard = {
  id: "dpD",
  canonicalId: "ci_MAE",
  slug: "lorcana-ci_MAE",
  printings: [
    {
      id: "set13-243-enchanted",
      artId: "ci_MAE-enchanted",
      setCode: "set13",
      collectorNumber: "243",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-194"],
  cardType: "character",
  name: "Scar",
  version: "Created by the Vine",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "013",
  cardNumber: 243,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Victor's Reward",
      description:
        "During your turn, whenever one of your Floodborn characters banishes another character in a challenge, gain 1 lore.",
    },
    {
      title: "Fill the Ranks",
      description:
        "During an opponent's turn, whenever one of your Floodborn characters is banished, draw a card.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: scarCreatedByTheVine.abilities,
  i18n: scarCreatedByTheVineEnchantedI18n,
};
