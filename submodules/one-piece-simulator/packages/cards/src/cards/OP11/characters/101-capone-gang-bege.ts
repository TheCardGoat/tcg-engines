import type { CharacterCard } from "@tcg/op-types";
import { op11CaponeGangBege101I18n } from "./101-capone-gang-bege.i18n.ts";

export const op11CaponeGangBege101: CharacterCard = {
  id: "OP11-101",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP11",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Firetank Pirates Supernovas"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-101_p1.jpg",
      imageId: "OP11-101_p1",
    },
  ],
  effect:
    '[Blocker]\n[Once Per Turn] If your "Supernovas" type Character other than [Capone"Gang"Bege] would be removed from the field by your opponent\'s effect, you may add it to the top of your Life cards face-down instead.',
  effects: {
    keywords: ["blocker"],
  },
  i18n: op11CaponeGangBege101I18n,
};
