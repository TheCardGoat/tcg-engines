import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesMeticulousSchemerI18n } from "./156-hades-meticulous-schemer.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const hadesMeticulousSchemer: CharacterCard = {
  id: "iib",
  canonicalId: "ci_iib",
  slug: "lorcana-ci_iib",
  printings: [
    {
      id: "set13-156",
      artId: "set13-156",
      setCode: "set13",
      collectorNumber: "156",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-156"],
  cardType: "character",
  name: "Hades",
  version: "Meticulous Schemer",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "013",
  cardNumber: 156,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: true,
  text: "Ward",
  classifications: ["Storyborn", "Villain"],
  abilities: [ward],
  i18n: hadesMeticulousSchemerI18n,
};
