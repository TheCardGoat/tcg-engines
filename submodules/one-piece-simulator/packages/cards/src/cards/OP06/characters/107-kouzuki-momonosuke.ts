import type { CharacterCard } from "@tcg/op-types";
import { op06KouzukiMomonosuke107I18n } from "./107-kouzuki-momonosuke.i18n.ts";

export const op06KouzukiMomonosuke107: CharacterCard = {
  id: "OP06-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP06",
  cost: 5,
  power: 6000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-107_p1.jpg",
      imageId: "OP06-107_p1",
    },
  ],
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Add up to 1 of your "Land of Wano" type Characters other than [Kouzuki Momonosuke] to the top or bottom of the owner\'s Life cards face-up.',
  effects: {
    keywords: ["blocker"],
  },
  i18n: op06KouzukiMomonosuke107I18n,
};
