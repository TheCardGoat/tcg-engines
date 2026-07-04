import type { CharacterCard } from "@tcg/op-types";
import { op04SpeedJilDashPack006I18n } from "./006-speed-jil-dash-pack.i18n.ts";

export const op04SpeedJilDashPack006: CharacterCard = {
  id: "OP03-006",
  canonicalId: "OP03-006",
  slug: "speed-jil-dash-pack",
  name: "Speed Jil (Dash Pack)",
  printings: [
    {
      id: "OP03-006",
      artId: "OP03-006",
      setCode: "OP04",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-006.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op04SpeedJilDashPack006I18n,
};
