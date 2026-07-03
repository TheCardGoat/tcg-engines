import type { CharacterCard } from "@tcg/lorcana-types";
import { todCopperBestOfFriendsI18n } from "./094-tod-copper-best-of-friends.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const todCopperBestOfFriends: CharacterCard = {
  id: "zHc",
  canonicalId: "ci_zHc",
  slug: "lorcana-ci_zHc",
  printings: [
    {
      id: "set13-094",
      artId: "set13-094",
      setCode: "set13",
      collectorNumber: "94",
      rarity: "rare",
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
  cardNumber: 94,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "<Shift> 2 {I}",
    },
    {
      title: "<Evasive>",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Puppy"],
  abilities: [shift("Tod or Copper", 2), evasive],
  i18n: todCopperBestOfFriendsI18n,
};
