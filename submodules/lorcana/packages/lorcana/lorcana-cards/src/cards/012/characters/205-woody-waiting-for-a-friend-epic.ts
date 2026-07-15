import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyWaitingForAFriendEpicI18n } from "./205-woody-waiting-for-a-friend-epic.i18n";

export const woodyWaitingForAFriendEpic: CharacterCard = {
  id: "CLZ",
  canonicalId: "ci_Zfj",
  slug: "lorcana-ci_Zfj",
  printings: [
    {
      id: "set12-205-epic",
      artId: "ci_Zfj-epic",
      setCode: "set12",
      collectorNumber: "205",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-003"],
  cardType: "character",
  name: "Woody",
  version: "Waiting for a Friend",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 205,
  rarity: "common",
  specialRarity: "epic",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2eb1fa4c7ab0498b8d4cfcd28f56a8cf",
    tcgPlayer: "692203",
  },
  classifications: ["Storyborn", "Hero", "Toy"],
  i18n: woodyWaitingForAFriendEpicI18n,
};
