import type { CharacterCard } from "@tcg/op-types";
import { op01Kaido094I18n } from "./094-kaido.i18n.ts";

export const op01Kaido094: CharacterCard = {
  id: "OP01-094",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP01",
  cost: 10,
  power: 12000,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-094_p1.jpg",
      imageId: "OP01-094_p1",
    },
  ],
  effect:
    '[On Play] DON!! -6 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the "Animal Kingdom Pirates" type, K.O. all Characters other than this Character.',
  i18n: op01Kaido094I18n,
};
