import type { CharacterCard } from "@tcg/op-types";
import { op16BoaHancock112I18n } from "./op16-112-boa-hancock.i18n.ts";

export const op16BoaHancock112: CharacterCard = {
  id: "OP16-112",
  canonicalId: "OP16-112",
  slug: "boa-hancock/op16-112",
  name: "Boa Hancock",
  printings: [
    {
      id: "OP16-112",
      artId: "OP16-112",
      setCode: "OP16",
      collectorNumber: "112",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-112_aHxLsc3.jpg",
      label: "Boa Hancock (112)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP16",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Kuja Pirates"],
  attribute: "special",
  i18n: op16BoaHancock112I18n,
};
