import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrueFriendI18n } from "./013-mickey-mouse-true-friend.i18n";

export const mickeyMouseTrueFriend: CharacterCard = {
  id: "mvj",
  canonicalId: "ci_mvj",
  slug: "lorcana-ci_mvj",
  printings: [
    {
      id: "set9-013",
      artId: "set9-013",
      setCode: "set9",
      collectorNumber: "13",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-012", "set9-013"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "True Friend",
  inkType: ["amber"],
  set: "009",
  cardNumber: 13,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_da34abc7da464b338103666b1ca3d0f8",
    tcgPlayer: "649962",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: mickeyMouseTrueFriendI18n,
};
