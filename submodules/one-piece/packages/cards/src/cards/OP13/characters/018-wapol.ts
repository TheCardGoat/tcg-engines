import type { CharacterCard } from "@tcg/op-types";
import { op13Wapol018I18n } from "./018-wapol.i18n.ts";

export const op13Wapol018: CharacterCard = {
  id: "OP13-018",
  canonicalId: "OP13-018",
  slug: "wapol/op13-018",
  name: "Wapol",
  printings: [
    {
      id: "OP13-018",
      artId: "OP13-018",
      setCode: "OP13",
      collectorNumber: "018",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-018_4Dm06t2.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Evil Black Drum Kingdom"],
  attribute: "strike",
  i18n: op13Wapol018I18n,
};
