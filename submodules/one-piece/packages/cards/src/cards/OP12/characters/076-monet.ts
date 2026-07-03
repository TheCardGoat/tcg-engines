import type { CharacterCard } from "@tcg/op-types";
import { op12Monet076I18n } from "./076-monet.i18n.ts";

export const op12Monet076: CharacterCard = {
  id: "OP12-076",
  canonicalId: "OP12-076",
  slug: "monet/op12-076",
  name: "Monet",
  printings: [
    {
      id: "OP12-076",
      artId: "OP12-076",
      setCode: "OP12",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-076_aKqMLsE.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Donquixote Pirates Punk Hazard"],
  attribute: "special",
  i18n: op12Monet076I18n,
};
