import type { CharacterCard } from "@tcg/lorcana-types";
import { liloStitchFunlovingFriendsI18n } from "./031-lilo-stitch-fun-loving-friends.i18n";

import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";
import { support } from "../../../helpers/abilities/support";

export const liloStitchFunlovingFriends: CharacterCard = {
  id: "did",
  canonicalId: "ci_Hvk",
  slug: "lorcana-ci_Hvk",
  printings: [
    {
      id: "set13-031",
      artId: "set13-031",
      setCode: "set13",
      collectorNumber: "31",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-031"],
  cardType: "character",
  name: "Lilo & Stitch",
  version: "Fun-Loving Friends",
  inkType: ["amber", "steel"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 31,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_dadb6d9a8ac54b6c8caad9225f07afa8",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "Resist +1",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Alien"],
  abilities: [shift("Lilo or Stitch", 3), resist(1), support],
  i18n: liloStitchFunlovingFriendsI18n,
};
