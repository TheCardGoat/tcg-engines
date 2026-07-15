import type { CharacterCard } from "@tcg/op-types";
import { eb01Hamlet024I18n } from "./024-hamlet.i18n.ts";

export const eb01Hamlet024: CharacterCard = {
  id: "EB01-024",
  canonicalId: "EB01-024",
  slug: "hamlet/eb01-024",
  name: "Hamlet",
  printings: [
    {
      id: "EB01-024",
      artId: "EB01-024",
      setCode: "EB01",
      collectorNumber: "024",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-024.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "slash",
  effect:
    "If you have 4 or less cards in your hand, all of your [SMILE] type Characters gain +1000 power.",
  i18n: eb01Hamlet024I18n,
};
