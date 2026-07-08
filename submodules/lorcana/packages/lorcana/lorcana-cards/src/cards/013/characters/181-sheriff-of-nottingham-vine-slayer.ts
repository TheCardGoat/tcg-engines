import type { CharacterCard } from "@tcg/lorcana-types";
import { sheriffOfNottinghamVineSlayerI18n } from "./181-sheriff-of-nottingham-vine-slayer.i18n";

import { challenger } from "../../../helpers/abilities/challenger";

export const sheriffOfNottinghamVineSlayer: CharacterCard = {
  id: "y59",
  canonicalId: "ci_y59",
  slug: "lorcana-ci_y59",
  printings: [
    {
      id: "set13-181",
      artId: "set13-181",
      setCode: "set13",
      collectorNumber: "181",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-181"],
  cardType: "character",
  name: "Sheriff of Nottingham",
  version: "Vine Slayer",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "013",
  cardNumber: 181,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  text: "Challenger +3",
  classifications: ["Storyborn", "Villain"],
  abilities: [challenger(3)],
  i18n: sheriffOfNottinghamVineSlayerI18n,
};
