import type { CharacterCard } from "@tcg/op-types";
import { op02KouzukiToki031I18n } from "./031-kouzuki-toki.i18n.ts";

export const op02KouzukiToki031: CharacterCard = {
  id: "OP02-031",
  canonicalId: "OP02-031",
  slug: "kouzuki-toki",
  name: "Kouzuki Toki",
  printings: [
    {
      id: "OP02-031",
      artId: "OP02-031",
      setCode: "OP02",
      collectorNumber: "031",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-031.jpg",
    },
    {
      id: "OP02-031_p1",
      artId: "OP02-031_p1",
      setCode: "OP02",
      collectorNumber: "031",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-031_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-031_p1.jpg",
      imageId: "OP02-031_p1",
    },
  ],
  effect:
    "If you have a [Kouzuki Oden] Character, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op02KouzukiToki031I18n,
};
