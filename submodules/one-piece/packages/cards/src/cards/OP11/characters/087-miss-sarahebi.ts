import type { CharacterCard } from "@tcg/op-types";
import { op11MissSarahebi087I18n } from "./087-miss-sarahebi.i18n.ts";

export const op11MissSarahebi087: CharacterCard = {
  id: "OP11-087",
  canonicalId: "OP11-087",
  slug: "miss-sarahebi",
  name: "Miss Sarahebi",
  printings: [
    {
      id: "OP11-087",
      artId: "OP11-087",
      setCode: "OP11",
      collectorNumber: "087",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-087.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "wisdom",
  i18n: op11MissSarahebi087I18n,
};
