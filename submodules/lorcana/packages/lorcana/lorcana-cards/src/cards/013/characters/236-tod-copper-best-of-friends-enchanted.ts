import type { CharacterCard } from "@tcg/lorcana-types";
import { todCopperBestOfFriendsEnchantedI18n } from "./236-tod-copper-best-of-friends-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const todCopperBestOfFriendsEnchanted: CharacterCard = {
  id: "33r",
  canonicalId: "ci_zHc",
  slug: "lorcana-ci_zHc",
  printings: [
    {
      id: "set13-236-enchanted",
      artId: "ci_zHc-enchanted",
      setCode: "set13",
      collectorNumber: "236",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-094"],
  cardType: "character",
  name: "Tod & Copper",
  version: "Best of Friends",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "013",
  cardNumber: 236,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Puppy"],
  abilities: [shift("Tod or Copper", 2), evasive],
  i18n: todCopperBestOfFriendsEnchantedI18n,
};
