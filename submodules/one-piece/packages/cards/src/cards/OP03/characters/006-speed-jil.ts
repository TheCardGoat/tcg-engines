import type { CharacterCard } from "@tcg/op-types";
import { op03SpeedJil006I18n } from "./006-speed-jil.i18n.ts";

export const op03SpeedJil006: CharacterCard = {
  id: "OP03-006",
  canonicalId: "OP03-006",
  slug: "speed-jil/op03-006",
  name: "Speed Jil",
  printings: [
    {
      id: "OP03-006",
      artId: "OP03-006",
      setCode: "OP03",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-006_tqFRtL6.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op03SpeedJil006I18n,
};
