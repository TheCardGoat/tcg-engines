import type { CharacterCard } from "@tcg/lorcana-types";
import { liloStitchFunlovingFriends } from "./031-lilo-stitch-fun-loving-friends";
import { liloStitchFunlovingFriendsIconicI18n } from "./244-lilo-stitch-fun-loving-friends-iconic.i18n";

export const liloStitchFunlovingFriendsIconic: CharacterCard = {
  ...liloStitchFunlovingFriends,
  id: "jdZ",
  printings: [
    {
      id: "set13-244-iconic",
      artId: "ci_Hvk-iconic",
      setCode: "set13",
      collectorNumber: "244",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  cardNumber: 244,
  rarity: "common",
  specialRarity: "iconic",
  i18n: liloStitchFunlovingFriendsIconicI18n,
};
