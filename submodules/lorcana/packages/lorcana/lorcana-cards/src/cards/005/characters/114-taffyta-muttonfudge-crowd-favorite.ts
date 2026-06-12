import type { CharacterCard } from "@tcg/lorcana-types";
import { taffytaMuttonfudgeCrowdFavoriteI18n } from "./114-taffyta-muttonfudge-crowd-favorite.i18n";

export const taffytaMuttonfudgeCrowdFavorite: CharacterCard = {
  id: "47M",
  canonicalId: "ci_47M",
  reprints: ["set5-114"],
  cardType: "character",
  name: "Taffyta Muttonfudge",
  version: "Crowd Favorite",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 114,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4a0125f47df34b3c9f0f097e0cc68c84",
    tcgPlayer: 555269,
  },
  text: [
    {
      title: "SHOWSTOPPER",
      description:
        "When you play this character, if you have a location in play, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
  abilities: [
    {
      condition: {
        type: "has-location-in-play",
        controller: "you",
      },
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1a4-1",
      name: "SHOWSTOPPER",
      text: "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: taffytaMuttonfudgeCrowdFavoriteI18n,
};
