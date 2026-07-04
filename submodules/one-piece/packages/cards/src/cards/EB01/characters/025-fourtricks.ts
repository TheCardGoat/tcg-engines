import type { CharacterCard } from "@tcg/op-types";
import { eb01Fourtricks025I18n } from "./025-fourtricks.i18n.ts";

export const eb01Fourtricks025: CharacterCard = {
  id: "EB01-025",
  canonicalId: "EB01-025",
  slug: "fourtricks",
  name: "Fourtricks",
  printings: [
    {
      id: "EB01-025",
      artId: "EB01-025",
      setCode: "EB01",
      collectorNumber: "025",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-025.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "slash",
  i18n: eb01Fourtricks025I18n,
};
