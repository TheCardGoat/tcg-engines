import type { CharacterCard } from "@tcg/op-types";
import { st04Ginrummy009I18n } from "./st04-009-ginrummy.i18n.ts";

export const st04Ginrummy009: CharacterCard = {
  id: "ST04-009",
  canonicalId: "ST04-009",
  slug: "ginrummy/st04-009",
  name: "Ginrummy",
  printings: [
    {
      id: "ST04-009",
      artId: "ST04-009",
      setCode: "ST04",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-009.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 1,
  traits: ["Animal Kingdom Pirates", "Smile"],
  power: 3000,
  attribute: "strike",
  counter: 1000,
  i18n: st04Ginrummy009I18n,
};
