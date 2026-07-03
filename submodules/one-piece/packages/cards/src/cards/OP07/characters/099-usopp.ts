import type { CharacterCard } from "@tcg/op-types";
import { op07Usopp099I18n } from "./099-usopp.i18n.ts";

export const op07Usopp099: CharacterCard = {
  id: "OP07-099",
  canonicalId: "OP07-099",
  slug: "usopp/op07-099",
  name: "Usopp",
  printings: [
    {
      id: "OP07-099",
      artId: "OP07-099",
      setCode: "OP07",
      collectorNumber: "099",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-099.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 2000,
  trigger:
    "Up to 1 of your {Egghead} type Leader or Character cards gains +2000 power until the end of your next turn.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "ranged",
  effect:
    "[Trigger] Up to 1 of your {Egghead} type Leader or Character cards gains +2000 power until the end of your next turn.",
  i18n: op07Usopp099I18n,
};
