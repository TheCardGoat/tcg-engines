import type { CharacterCard } from "@tcg/op-types";
import { st04XDrake013I18n } from "./st04-013-x-drake.i18n.ts";

export const st04XDrake013: CharacterCard = {
  id: "ST04-013",
  canonicalId: "ST04-013",
  slug: "x-drake/st04-013",
  name: "X.Drake",
  printings: [
    {
      id: "ST04-013",
      artId: "ST04-013",
      setCode: "ST04",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-013.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 3,
  traits: ["Navy", "Drake Pirates", "Animal Kingdom Pirates"],
  power: 5000,
  attribute: "slash",
  counter: 1000,
  i18n: st04XDrake013I18n,
};
