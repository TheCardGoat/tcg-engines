import type { CharacterCard } from "@tcg/op-types";
import { st30Jozu005I18n } from "./st30-005-jozu.i18n.ts";
export const st30Jozu005: CharacterCard = {
  id: "ST30-005",
  canonicalId: "ST30-005",
  slug: "jozu/st30-005",
  name: "Jozu",
  printings: [
    {
      id: "ST30-005",
      artId: "ST30-005",
      setCode: "ST30",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-005.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 5,
  traits: ["Whitebeard Pirates"],
  power: 6000,
  attribute: "strike",
  counter: 2000,
  i18n: st30Jozu005I18n,
};
