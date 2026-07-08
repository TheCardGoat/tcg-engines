import type { CharacterCard } from "@tcg/lorcana-types";
import { liloStitchFunlovingFriendsIconicI18n } from "./244-lilo-stitch-fun-loving-friends-iconic.i18n";

import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";
import { support } from "../../../helpers/abilities/support";

export const liloStitchFunlovingFriendsIconic: CharacterCard = {
  id: "jdZ",
  canonicalId: "ci_Hvk",
  slug: "lorcana-ci_Hvk",
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
  reprints: ["set13-031"],
  cardType: "character",
  name: "Lilo & Stitch",
  version: "Fun-Loving Friends",
  inkType: ["amber", "steel"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 244,
  rarity: "common",
  specialRarity: "iconic",
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
  i18n: liloStitchFunlovingFriendsIconicI18n,
};
