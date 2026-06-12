import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffySt16005PirateFoil005I18n } from "./005-monkey-d-luffy-st16-005-pirate-foil.i18n.ts";

export const prb02MonkeyDLuffySt16005PirateFoil005: CharacterCard = {
  id: "ST16-005",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["FILM Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST16-005_r1.jpg",
      imageId: "ST16-005_r1",
    },
  ],
  effect: "If you have a rested [Uta], this Character gains +1000 power.",
  i18n: prb02MonkeyDLuffySt16005PirateFoil005I18n,
};
